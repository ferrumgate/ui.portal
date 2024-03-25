import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login2FA } from 'src/app/modules/shared/models/login';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { ConfigBrand } from '../shared/models/config';
import { SSubscription } from '../shared/services/SSubscribtion';

@Component({
  selector: 'app-confirm2fa',
  templateUrl: './confirm2fa.component.html',
  styleUrls: ['./confirm2fa.component.scss']
})
export class Confirm2FAComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  isThemeDark = false;
  device: any;
  title: string;

  /// 2FA 
  is2FA = false;
  hideToken = false;
  model2fa: Login2FA = {};
  form2FA: FormGroup = this.createFormGroup(this.model2fa);

  error2fa: { token: string };
  //tunnelSessionKey = '';

  @Output() submitEM = new EventEmitter();

  brand: ConfigBrand = {};
  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private captchaService: CaptchaService) {
    this.title = "Title";

    this.error2fa = this.resetErrors2FA();
    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })

    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.route.queryParams.subscribe(params => {
      this.model2fa.key = params.key;
    })

    this.brand = this.configService.brand;
    this.allSub.addThis =
      this.configService.dynamicConfigChanged.subscribe(x => {
        this.brand = this.configService.brand;
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
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  ngAfterViewInit(): void {

  }

  ///// 2fa
  createFormGroup(model: Login2FA) {
    const fmg = new FormGroup(
      {

        token: new FormControl(model.token, [Validators.required])
      }
    );
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model2fa as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged2FA();
      })
    return fmg;
  }

  modelChanged2FA() {

    this.checkFormError2FA();
  }

  checkFormError2FA() {
    //check errors 
    this.error2fa = this.resetErrors2FA();
    const tokenError = this.form2FA.controls['token'].errors;
    if (tokenError) {

      if (tokenError['required'])
        this.error2fa.token = 'TokenRequired';
      else
        this.error2fa.token = 'TokenInvalid';
    }

  }
  submit2FA() {

    if (!this.form2FA?.valid || !this.model2fa.token) {
      //TODO notification message can be all so good
      this.error2fa.token = this.translateService.translate('FormIsInvalid');
      return;
    }

    this.authService.confirm2FA(this.model2fa.key || '', this.model2fa.token || '').subscribe();

  }

}
