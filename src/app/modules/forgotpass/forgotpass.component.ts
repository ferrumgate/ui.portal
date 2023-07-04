import { BreakpointObserver } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { ForgotPass } from 'src/app/modules/shared/models/forgotpass';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SSubscription } from '../shared/services/SSubscribtion';
import { ConfigBrand } from '../shared/models/config';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss']
})
export class ForgotPassComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  isThemeDark = false;
  device: any;
  model: ForgotPass = {};
  isForgotPassSended = false;





  error: { email: string, send: string };
  form: FormGroup = this.createFormGroup(this.model);

  @Output() submitEM = new EventEmitter();
  brand: ConfigBrand = {};
  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private captchaService: CaptchaService
  ) {
    this.error = this.resetErrrors();
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


  }


  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  createFormGroup(model: ForgotPass) {
    const fmg = new FormGroup(
      {
        email: new FormControl(model.email, [Validators.required, InputService.emailValidator])
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

  resetErrrors() {
    return {
      email: '', send: ''
    };
  }

  submit() {

    if (!this.form?.valid || !this.model.email) {
      this.error.send = this.translateService.translate('FormIsInvalid');
      return;
    }

    this.authService.forgotPassword(this.model.email).subscribe((x: any) => {

      this.isForgotPassSended = true;
      this.error = this.resetErrrors();
    })


  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrrors();
    const emailError = this.form.controls['email'].errors;
    if (emailError) {

      if (emailError['required'])
        this.error.email = 'EmailRequired';
      else
        this.error.email = 'EmailInvalid';


    }

  }
  modelChanged() {
    this.checkFormError();
  }

}
