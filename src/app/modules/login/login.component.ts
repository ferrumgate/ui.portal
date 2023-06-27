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
import { SSubscription } from '../shared/services/SSubscribtion';
import { ConfigBrand } from '../shared/models/config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  allSub = new SSubscription();
  isThemeDark = false;
  device: any;
  title: string;

  model: Login = {};
  error: { email: string, password: string, login: string };

  isLogined = false;

  tunnelSessionKey = '';
  exchangeKey = '';

  form: FormGroup = this.createFormGroup(this.model);
  hidePassword = true;
  brand: ConfigBrand = {};

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

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.brand = this.configService.brand;
    this.allSub.addThis =
      this.configService.dynamicConfigChanged.subscribe(x => {
        this.brand = this.configService.brand;
      })


    this.route.queryParams.subscribe(params => {

      let isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
      this.tunnelSessionKey = params.tunnel;
      this.exchangeKey = params.exchange;
      //if tunnel key exits save first
      if (this.tunnelSessionKey)
        this.authService.setSessionTunnelKey(this.tunnelSessionKey);
      else
        if (this.exchangeKey)
          this.authService.setSessionExchangeKey(this.exchangeKey);
        else {
          //check storage if exits
          const tunnelSessionKey = this.authService.getSessionTunnelKey();
          if (tunnelSessionKey)
            this.router.navigate(['/login'], { queryParams: { tunnel: tunnelSessionKey, isCaptchaEnabled: isCaptchaEnabled } })

          const exchangeSessionKey = this.authService.getSessionExchangeKey();
          if (exchangeSessionKey)
            this.router.navigate(['/login'], { queryParams: { exchange: exchangeSessionKey, isCaptchaEnabled: isCaptchaEnabled } })


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
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }
  createFormGroup(model: Login) {
    const fmg = new FormGroup(
      {
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      }
    );
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;

  }

  private loginLocal() {
    return this.authService.loginLocal(this.model.email || '', this.model.password || '');
  }


  submit() {

    if (!this.form?.valid || !this.model.email || !this.model.password) {
      this.error.login = this.translateService.translate('FormIsInvalid');
      return;
    }

    this.loginLocal().subscribe();


  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrors();
    const emailError = this.form.controls['email'].errors;
    if (emailError) {

      if (emailError['required'])
        this.error.email = 'EmailOrUsernameRequired';
      else
        this.error.email = 'EmailOrUsernameInvalid';


    }

    const passwordError = this.form.controls['password'].errors;
    if (passwordError) {

      if (passwordError['required'])
        this.error.password = 'PasswordRequired';
      else
        this.error.password = 'PasswordRequired';


    }

  }
  modelChanged() {

    this.checkFormError();
  }



  get oAuthGoogleAuthenticateUrl() {
    return this.authService.googleAuthenticateUrl;
  }
  get oAuthLinkedinAuthenticateUrl() {
    return this.authService.linkedinAuthenticateUrl;
  }

  get samlAuth0AuthenticateUrl() {
    return this.authService.auth0AuthenticateUrl;
  }
  get samlAzureADAuthenticateUrl() {
    return this.authService.azureADAuthenticateUrl;
  }

  get isForgotPasswordEnabled() {

    return this.configService.isEnabledForgotPassword;
  }

  get isRegisterEnabled() {
    return this.configService.isEnabledRegister;
  }

  get isOAuthGoogleEnabled() {
    return this.configService.isLoginEnabledOAuthGoogle;
  }
  get isOAuthLinkedInEnabled() {
    return this.configService.isLoginEnabledOAuthLinkedin;
  }
  get isSamlAuth0Enabled() {
    return this.configService.isLoginEnabledSamlAuth0;
  }
  get isSamlAzureADEnabled() {
    return this.configService.isLoginEnabledSamlAzure;
  }

  get isGithubEnabled() {
    return false;
  }
  get isMicrosoftEnabled() {
    return false;
  }
  /* get isAuth0Enabled() {
    return true;
  } */
  // if added something here add also 

  get isOthersEnabled() {
    return this.isOAuthGoogleEnabled || this.isOAuthLinkedInEnabled ||
      this.isGithubEnabled || this.isMicrosoftEnabled ||
      this.isSamlAuth0Enabled ||
      this.isSamlAzureADEnabled;
  }

}
