import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
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
export class LoginComponent implements OnInit, AfterViewInit {
  isThemeDark = false;
  device: any;
  title: string;

  model: Login = {};
  error: { email: string, password: string, login: string };

  isLogined = false;
  isCaptchaEnabled = false;
  tunnelSessionKey = '';

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
    this.error = this.resetErrors();


    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';


    this.route.queryParams.subscribe(params => {

      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
      this.tunnelSessionKey = params.tunnel;
      //if tunnel key exits save first
      if (this.tunnelSessionKey)
        this.authService.setTunnelSessionKey(this.tunnelSessionKey);
      else {
        //check storage if exits
        const tunnelSessionKey = this.authService.getTunnelSessionKey();
        if (tunnelSessionKey)
          this.router.navigate(['/login'], { queryParams: { tunnel: tunnelSessionKey, isCaptchaEnabled: this.isCaptchaEnabled } })
      }


    })
  }

  resetErrors() {
    return {
      email: '', password: '', login: ''
    };
  }



  ngOnInit(): void {


  }
  ngAfterViewInit(): void {

  }

  private loginLocal(captcha?: string, action?: string) {

    return this.authService.loginLocal(this.model.email || '', this.model.password || '', captcha, action);
  }


  submit() {

    if (!this.form?.valid || !this.model.email || !this.model.password) {
      this.error.login = this.translateService.translate('FormIsInvalid');
      return;
    }

    if (this.isCaptchaEnabled) {
      this.captchaService.execute('login').pipe(
        switchMap((token: any) => {
          return this.loginLocal(token, 'login');
        })
      ).subscribe();
    } else {
      this.loginLocal().subscribe();
    }

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrors();
    const emailError = this.form.controls['email'].errors;
    if (emailError) {

      if (emailError['required'])
        this.error.email = 'EmailRequired';
      else
        this.error.email = 'EmailInvalid';


    }

    const passwordError = this.form.controls['password'].errors;
    if (passwordError) {

      if (passwordError['required'])
        this.error.password = 'PasswordRequired';
      else
        this.error.password = 'PasswordRequired';


    }

  }
  modelChanged($event: any) {

    this.checkFormError();
  }



  get googleAuthenticateUrl() {
    return this.authService.googleAuthenticateUrl;
  }

  get isForgotPasswordEnabled() {

    return this.configService.isEnabledForgotPassword;
  }
  get isRegisterEnabled() {
    return this.configService.isEnabledRegister;
  }

  get isGoogleEnabled() {
    return this.configService.isLoginEnabledGoogle;
  }
  get isLinkedInEnabled() {
    return this.configService.isLoginEnabledLinkedin;
  }

  get isGithubEnabled() {
    return false;
  }
  get isMicrosoftEnabled() {
    return false;
  }

  get isOthersEnabled() {
    return this.isGoogleEnabled || this.isLinkedInEnabled || this.isGithubEnabled || this.isMicrosoftEnabled;
  }

}
