import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResetPass } from 'src/app/modules/shared/models/resetpass';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { ConfigBrand } from '../shared/models/config';
import { SSubscription } from '../shared/services/SSubscribtion';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss']
})
export class ResetPassComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  isThemeDark = false;
  device: any;
  model: ResetPass = {};
  isPasswordChanged = false;
  hidePasswordAgain = true;
  hidePassword = true;
  key: string = '';
  form: FormGroup = this.createFormGroup(this.model);

  error: { password: string, passwordAgain: string, save: string };

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

    this.route.queryParams.subscribe(params => {
      this.key = params.key;
    })

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
  createFormGroup(model: ResetPass) {
    const fmg = new FormGroup(
      {
        password: new FormControl(model.password, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
        passwordAgain: new FormControl(model.passwordAgain, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      },
      {
        validators: Validators.compose([InputService.matchingPasswords('password', 'passwordAgain')])
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
      email: '', password: '', passwordAgain: '', save: ''
    };
  }

  submit() {

    if (!this.form?.valid || !this.model.password) {
      this.error.save = this.translateService.translate('FormIsInvalid');
      return;
    }

    this.authService.resetPassword(this.key, this.model.password)
      .subscribe((x: any) => {

        this.isPasswordChanged = true;
        this.error = this.resetErrrors();
      })

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrrors();

    const passwordError = this.form.controls['password'].errors;
    if (passwordError) {

      if (passwordError['required'])
        this.error.password = 'PasswordRequired';
      else if (passwordError['minlength'])
        this.error.password = 'PasswordMinLength';
      else if (passwordError['pattern'])
        this.error.password = 'PasswordPattern';
      else if (passwordError['mismatchedPasswords'])
        this.error.password = 'PasswordsMismatch';
      else
        this.error.password = 'PasswordInvalid';

    }

    const passwordAgainError = this.form.controls['passwordAgain'].errors;
    if (passwordAgainError) {

      if (passwordAgainError['required'])
        this.error.passwordAgain = 'PasswordAgainRequired';
      else if (passwordAgainError['minlength'])
        this.error.passwordAgain = 'PasswordAgainMinLength';
      else if (passwordAgainError['pattern'])
        this.error.passwordAgain = 'PasswordAgainPattern';
      else if (passwordAgainError['mismatchedPasswords'])
        this.error.passwordAgain = 'PasswordsMismatch';
      else
        this.error.passwordAgain = 'PasswordInvalid';

    }
  }

  modelChanged() {

    this.checkFormError();
  }

}
