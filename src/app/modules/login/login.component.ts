import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { RunHelpers } from 'rxjs/testing';
import { Login, Login2FA } from 'src/app/modules/shared/models/login';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { LoggerService } from 'src/app/modules/shared/services/logger.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { RBACDefault } from '../shared/models/rbac';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isThemeDark = false;
  device: any;
  title: string;

  model: Login = {};
  error: { email: string, password: string, login: string };

  isLogined = false;
  isCaptchaEnabled = false;

  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, InputService.emailValidator]),
      password: new FormControl('', [Validators.required])
    }
  );

  hidePassword = true;

  /// 2FA 
  is2FA = false;
  hideToken = true;
  form2FA: FormGroup = new FormGroup(
    {

      token: new FormControl('', [Validators.required])
    }
  );

  model2fa: Login2FA = {};
  error2fa: { token: string };

  @Output() submitEM = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private captchaService: CaptchaService) {
    this.title = "Title";
    this.error = this.resetErrors();
    this.error2fa = this.resetErrors2FA();

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';


    this.route.queryParams.subscribe(params => {
      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
    })
  }
  resetErrors() {
    return {
      email: '', password: '', login: ''
    };
  }

  resetErrors2FA() {
    return {
      token: ''
    };
  }

  ngOnInit(): void {

  }
  private navigateAfterLogin() {

    if (!this.authService.currentSession)
      throw new Error('something went wrong');

    const isAdmin = this.authService.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleAdmin.name);
    const isReporter = this.authService.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleReporter.name);
    const isUser = this.authService.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleUser.name);

    if ((isAdmin || isReporter)) {
      this.router.navigate(['/screenswitch']);
    }
    else {
      this.router.navigate(['/dashboard']);
    }


  }
  private login(captcha?: string, action?: string) {
    //reset when starting login
    this.model2fa.key = undefined;//this is an impontant security enhancement
    this.is2FA = false;
    return this.authService.loginLocal(this.model.email || '', this.model.password || '', captcha, action)
      .pipe(switchMap(x => {
        this.error = this.resetErrors();
        let response: {
          key: string, is2FA: boolean
        } = x;
        if (response.is2FA) {
          return of('').pipe(map(x => {
            this.model2fa.key = response.key;
            this.is2FA = true;
          }))

        } else {

          return this.authService.getAccessToken(response.key)
            .pipe(
              switchMap(x => {
                return this.authService.getUserCurrent();
              }),
              map(() => {
                this.isLogined = true;
                this.error = this.resetErrors();
                this.navigateAfterLogin();

              }))
        }
      }))
  }
  submit() {

    if (!this.form?.valid || !this.model.email || !this.model.password) {
      this.error.login = this.translateService.translate('FormIsInvalid');
      return;
    }

    if (this.isCaptchaEnabled) {
      this.captchaService.execute('login').pipe(
        switchMap((token: any) => {
          return this.login(token, 'login');
        })
      ).subscribe();
    } else {
      this.login().subscribe();
    }

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrors();
    const emailError = this.form.controls['email'].errors;
    if (emailError) {
      Object.keys(emailError).forEach(x => {
        switch (x) {
          case 'required':
            this.error.email = 'EmailRequired';
            break;
          default:
            this.error.email = 'EmailInvalid'; break;
        }
      })

    }

    const passwordError = this.form.controls['password'].errors;
    if (passwordError) {
      Object.keys(passwordError).forEach(x => {
        switch (x) {
          case 'required':
            this.error.password = 'PasswordRequired';
            break;
        }
      })
    }

  }
  modelChanged($event: any) {

    this.checkFormError();
  }

  ///// 2fa

  modelChanged2FA($event: any) {

    this.checkFormError2FA();
  }

  checkFormError2FA() {
    //check errors 
    this.error2fa = this.resetErrors2FA();
    const tokenError = this.form2FA.controls['token'].errors;
    if (tokenError) {
      Object.keys(tokenError).forEach(x => {
        switch (x) {
          case 'required':
            this.error2fa.token = 'TokenRequired';
            break;
          default:
            this.error2fa.token = 'TokenInvalid'; break;
        }
      })

    }



  }
  submit2FA() {

    if (!this.form2FA?.valid || !this.model2fa.token) {
      this.error2fa.token = this.translateService.translate('FormIsInvalid');
      return;
    }

    if (this.isCaptchaEnabled) {
      this.captchaService.execute('confirm2FA').pipe(
        switchMap((token: any) => {
          return this.confirm2FA(token, 'confirm2FA');
        })
      ).subscribe();
    } else {
      this.confirm2FA().subscribe();
    }

  }

  private confirm2FA(captcha?: string, action?: string) {
    return this.authService.confirm2FA(this.model2fa.key || '', this.model2fa.token || '', captcha, action)
      .pipe(switchMap((response: any) => {


        return this.authService.getAccessToken(response.key).pipe(map(() => {
          this.isLogined = true;
          this.error = this.resetErrors();
          this.router.navigate(['/dashboard']);
        }))
      }))

  }

}
