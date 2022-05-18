import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { RunHelpers } from 'rxjs/testing';
import { Login } from 'src/app/core/models/login';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CaptchaService } from 'src/app/core/services/captcha.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { InputService } from 'src/app/core/services/input.service';
import { LoggerService } from 'src/app/core/services/logger.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TranslationService } from 'src/app/core/services/translation.service';


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
    this.error = this.resetErrrors();

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.route.queryParams.subscribe(params => {
      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
    })
  }
  resetErrrors() {
    return {
      email: '', password: '', login: ''
    };
  }

  ngOnInit(): void {

  }

  submit() {

    if (!this.form?.valid || !this.model.email || !this.model.password) {
      this.error.login = this.translateService.translate('FormIsInvalid');
      return;
    }


    if (this.isCaptchaEnabled) {
      this.captchaService.execute('login').pipe(
        switchMap((token: any) => {
          return this.authService.loginLocal(this.model.email || '', this.model.password || '', token, 'login')
        })
      ).subscribe(x => {
        this.isLogined = true;
        this.error = this.resetErrrors();
        this.router.navigate(['/dashboard']);
      });
    } else {

      this.authService.loginLocal(this.model.email, this.model.password).subscribe(x => {
        this.isLogined = true;
        this.error = this.resetErrrors();
      })
    }

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrrors();
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

}
