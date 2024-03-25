import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthLocal } from '../../models/auth';
import { SSubscription } from '../../services/SSubscribtion';
import { ConfigService } from '../../services/config.service';
import { TranslationService } from '../../services/translation.service';

export interface AuthLocalExtended extends AuthLocal {
  orig: AuthLocal;
  isChanged: boolean;

}

@Component({
  selector: 'app-auth-local',
  templateUrl: './auth-local.component.html',
  styleUrls: ['./auth-local.component.scss']
})
export class AuthLocalComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _model: AuthLocalExtended = {
    baseType: 'local', isChanged: false, name: 'Local',
    type: 'local', isForgotPassword: false, isRegister: false, tags: [],
    isEnabled: true,
    orig: {
      baseType: 'local', name: '',
      type: 'local', isForgotPassword: false, isRegister: false, tags: [],
      isEnabled: true
    }
  };

  get model(): AuthLocalExtended { return this._model; }
  @Input()
  set model(val: AuthLocal) {
    this._model = {
      ...val,
      baseType: 'local',
      type: 'local',
      orig: val,
      isChanged: false

    }
    this.formGroup = this.createFormGroup(this.model);

  }
  @Output()
  saveAuthLocal: EventEmitter<AuthLocal> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this.model);
  error = { type: '' };
  isThemeDark = false;
  constructor(
    private configService: ConfigService,
    private translateService: TranslationService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //for testing;
    this.helpLink = this.configService.links.authLocalHelp;
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        type: new FormControl(model.type, []),
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

  resetFormErrors() {

    return {
      type: ''
    }
  }
  modelChanged() {
    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }
  checkIfModelChanged() {
    let model = this.model as AuthLocalExtended;
    model.isChanged = false;
    const original = model.orig;
    if (original.isForgotPassword != model.isForgotPassword)
      model.isChanged = true;
    if (original.isRegister != model.isRegister)
      model.isChanged = true;
    if (original.isEnabled != model.isEnabled)
      model.isChanged = true;

  }
  checkFormError() {
    //check errors 
    this.error = this.resetFormErrors();

  }

  clear() {

    const orig = this.model.orig;
    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;
    this.model.orig = orig;

  }

  saveOrUpdate() {
    if (this.model.isChanged) {
      this.saveAuthLocal.emit(this.model);
    }
  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

}
