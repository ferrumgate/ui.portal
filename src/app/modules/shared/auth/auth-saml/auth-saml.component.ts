import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseOAuth, BaseSaml } from '../../models/auth';
import { ConfigService } from '../../services/config.service';
import { ConfirmService } from '../../services/confirm.service';
import { NotificationService } from '../../services/notification.service';
import { SSubscription } from '../../services/SSubscribtion';
import { TranslationService } from '../../services/translation.service';


interface BaseModel extends BaseSaml {

}
interface Model extends BaseModel {
  isChanged: boolean
  orig: BaseSaml
  svgIcon?: string
}
@Component({
  selector: 'app-auth-saml',
  templateUrl: './auth-saml.component.html',
  styleUrls: ['./auth-saml.component.scss']
})
export class AuthSamlComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';


  isThemeDark = false;
  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: BaseSaml) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      svgIcon: this.findIconName(val)
    }
    this.formGroup = this.createFormGroup(this._model);
  }
  findIconName(val: BaseSaml) {
    if (val.name.startsWith('Google'))
      return 'social-google';
    if (val.name.startsWith('Linkedin'))
      return 'social-linkedin'
    if (val.name.startsWith('Auth0'))
      return 'social-auth0'
    if (val.name.startsWith('Azure'))
      return 'social-azure'
    return undefined;
  }

  @Output()
  saveSaml: EventEmitter<BaseSaml> = new EventEmitter();
  @Output()
  deleteSaml: EventEmitter<BaseSaml> = new EventEmitter();



  //captcha settings
  formGroup: FormGroup;
  error = { issuer: '', cert: '', loginUrl: '', nameField: '', usernameField: '' };

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this._model = {
      issuer: '', cert: '', loginUrl: '', nameField: '', usernameField: '',
      baseType: 'saml', type: 'auth0', id: '', name: 'Saml',
      isChanged: false, isEnabled: true,
      orig:
      {
        issuer: '', cert: '', loginUrl: '', nameField: '', usernameField: '',
        baseType: 'saml', type: 'auth0', id: '', name: 'Saml',
        isEnabled: true

      }
    };
    this.formGroup = this.createFormGroup(this.model);

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.authSamlHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        loginUrl: new FormControl(model.loginUrl, [Validators.required]),
        issuer: new FormControl(model.issuer, [Validators.required]),
        cert: new FormControl(model.cert, [Validators.required]),
        nameField: new FormControl(model.nameField, [Validators.required]),
        usernameField: new FormControl(model.usernameField, [Validators.required]),
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
  resetErrors() {

    return { issuer: '', cert: '', loginUrl: '', nameField: '', usernameField: '' };
  }

  modelChanged() {
    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.model.isChanged = false;

  }

  checkFormError() {
    //check errors 
    this.error = this.resetErrors();

    const issuerError = this.formGroup.controls.issuer.errors;

    if (issuerError) {
      if (issuerError['required'])
        this.error.issuer = 'IssuerRequired';
      else
        this.error.issuer = 'IssuerRequired';
    }

    const certError = this.formGroup.controls.cert.errors;
    if (certError) {
      if (certError['required'])
        this.error.cert = 'CertRequired';
      else
        this.error.cert = 'CertRequired';
    }
    const loginUrlError = this.formGroup.controls.loginUrl.errors;
    if (loginUrlError) {
      if (loginUrlError['required'])
        this.error.loginUrl = 'LoginUrlRequired';
      else
        this.error.loginUrl = 'LoginUrlRequired';
    }
    const nameFieldError = this.formGroup.controls.nameField.errors;
    if (nameFieldError) {
      if (nameFieldError['required'])
        this.error.nameField = 'NameFieldRequired';
      else
        this.error.nameField = 'NameFieldRequired';
    }
    const usernameFieldError = this.formGroup.controls.usernameField.errors;
    if (usernameFieldError) {
      if (usernameFieldError['required'])
        this.error.usernameField = 'UsernameFieldRequired';
      else
        this.error.usernameField = 'UsernameFieldRequired';
    }
  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.loginUrl != model.loginUrl)
      model.isChanged = true;
    if (original.issuer != model.issuer)
      model.isChanged = true;
    if (original.cert != model.cert)
      model.isChanged = true;
    if (original.usernameField != model.usernameField)
      model.isChanged = true;
    if (original.nameField != model.nameField)
      model.isChanged = true;
    if (original.isEnabled != model.isEnabled)
      model.isChanged = true;
    if (original.saveNewUser != model.saveNewUser)
      model.isChanged = true;

  }


  clear() {

    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;

    this.formGroup.markAsUntouched();
  }

  createBaseModel(): BaseSaml {
    return {
      objId: this.model.objId,
      id: this.model.id,
      baseType: this.model.baseType,
      type: this.model.type,
      name: this.model.name,
      tags: this.model.tags,
      isEnabled: this.model.isEnabled,
      cert: this.model.cert,
      issuer: this.model.issuer,
      loginUrl: this.model.loginUrl,
      nameField: this.model.nameField,
      usernameField: this.model.usernameField,
      fingerPrint: this.model.fingerPrint,
      saveNewUser: this.model.saveNewUser,
      securityProfile: {
        ...this.model.securityProfile
      }

    }
  }
  saveOrUpdate() {
    if (this.formGroup.valid)
      this.saveSaml.emit(this.createBaseModel())
  }


  delete() {
    this.deleteSaml.emit(this.createBaseModel());
  }

  selectCertFile(event: any) {
    const file: File = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {

      if (fileReader?.result) {
        this.formGroup.controls.cert.setValue(fileReader.result.toString());
        this.modelChanged();
      }
    }
    fileReader.readAsText(file);
  }

}
