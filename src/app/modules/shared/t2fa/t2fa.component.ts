import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SSubscription } from '../services/SSubscribtion';
import { ConfigService } from '../services/config.service';
import { TranslationService } from '../services/translation.service';

export interface T2FA {
  is2FA: boolean;
  t2FAKey: string;
  key: string;
  token: string;
}
export interface T2FAExtended extends T2FA {
  isChanged: boolean;
  isActivated: boolean;
  token: string;
  orig: T2FA;
}

@Component({
  selector: 'app-t2fa',
  templateUrl: './t2fa.component.html',
  styleUrls: ['./t2fa.component.scss']
})
export class T2FAComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _model: T2FAExtended =
    {
      isChanged: false,
      is2FA: false,
      isActivated: false,
      t2FAKey: '',
      key: '',
      token: '',
      orig: {
        is2FA: false,
        t2FAKey: '',
        key: '',
        token: '',

      },

    };

  get t2fa(): T2FAExtended {
    return this._model;
  }

  @Input()
  set t2fa(val: T2FA) {
    this._model = {
      ...val,
      isChanged: false,
      isActivated: false,
      token: '',
      orig: val,

    }
    this.formGroup = this.createFormGroup(this.t2fa);

  }

  @Input()
  set t2faRefresh(val: { key: string, t2FAKey: string }) {
    this._model.key = val.key;
    this._model.t2FAKey = val.t2FAKey;
    this._model.token = '';
    this.formGroup.get('token')?.setValue('');
    this.modelChanged();
  }

  @Output()
  refreshT2FA: EventEmitter<T2FA> = new EventEmitter();

  get qrCode() {
    return `otpauth://totp/ferrumgate?secret=${this._model.t2FAKey}`
  }

  get isActivated() {

    return this._model.is2FA && (!this._model.orig.is2FA || this._model.t2FAKey != this._model.orig.t2FAKey);
  }

  @Output()
  saveT2FA: EventEmitter<T2FA> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { token: string } = { token: '' }

  isThemeDark = false;
  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.t2faHelp;
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }
  modelChanged() {

    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.t2fa.isChanged = false;

  }

  createFormGroup(model: T2FAExtended) {
    const fmg = new FormGroup({
      token: new FormControl(model.token, [Validators.required]),
    });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this._model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;
  }
  createFormError() {
    return { token: '' };
  }

  checkIfModelChanged() {
    this.t2fa.isChanged = false;
    const original = this._model.orig as T2FA;
    if (original.is2FA != this.t2fa.is2FA)
      this.t2fa.isChanged = true;
    if (original.t2FAKey != this.t2fa.t2FAKey)
      this.t2fa.isChanged = true;

  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();

    const tokenError = this.formGroup.controls['token'].errors;
    if (this.isActivated) {
      if (tokenError) {
        if (tokenError['required'])
          error.token = 'VerifyCodeRequired';
        else
          error.token = 'VerifyCodeRequired';
      }
    } else {
      this.formGroup.controls['token'].setErrors(null);
    }
    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as T2FA;

    this.t2fa = {
      ...original,
    }

    this.checkIfModelChanged();
  }
  createBaseModel(): T2FA {
    return {
      is2FA: this._model.is2FA, token: this._model.token,
      key: this._model.key, t2FAKey: this._model.t2FAKey
    }
  }

  saveOrUpdate() {

    this.saveT2FA.emit(this.createBaseModel());
  }
  refresh2FASecret() {
    this.refreshT2FA.emit(this.createBaseModel());

  }

}
