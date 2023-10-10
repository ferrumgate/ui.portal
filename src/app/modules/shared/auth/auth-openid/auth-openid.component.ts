import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseOAuth, BaseOpenId } from '../../models/auth';
import { ConfigService } from '../../services/config.service';
import { ConfirmService } from '../../services/confirm.service';
import { NotificationService } from '../../services/notification.service';
import { SSubscription } from '../../services/SSubscribtion';
import { TranslationService } from '../../services/translation.service';
import { InputService } from '../../services/input.service';


interface BaseModel extends BaseOpenId {

}
interface Model extends BaseModel {
  isChanged: boolean
  orig: BaseOpenId
  svgIcon?: string
}
@Component({
  selector: 'app-auth-openid',
  templateUrl: './auth-openid.component.html',
  styleUrls: ['./auth-openid.component.scss']
})
export class AuthOpenIdComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  hidePassword = true;
  isThemeDark = false;
  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: BaseOpenId) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      svgIcon: this.findIconName(val)
    }
    this.formGroup = this.createFormGroup(this._model);
  }
  findIconName(val: BaseOpenId) {
    if (val.name.startsWith('Google'))
      return 'social-google';
    if (val.name.startsWith('Linkedin'))
      return 'social-linkedin'
    if (val.name.startsWith('Auth0'))
      return 'social-auth0'
    if (val.name.startsWith('Azure'))
      return 'social-azure'

    return 'social-openid';
  }

  @Output()
  saveOpenId: EventEmitter<BaseOpenId> = new EventEmitter();
  @Output()
  deleteOpenId: EventEmitter<BaseOpenId> = new EventEmitter();



  //captcha settings
  formGroup: FormGroup;
  error = {
    name: '', shortName: '', discoveryUrl: '',
    clientId: '', clientSecret: '',
  };

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    private inputService: InputService) {

    this._model = {
      discoveryUrl: '',
      baseType: 'openId', type: 'generic', id: '', name: 'Generic', authName: 'generic',
      clientId: '', clientSecret: '',
      isChanged: false, isEnabled: true, saveNewUser: true,
      orig:
      {
        discoveryUrl: '',
        baseType: 'openId', type: 'generic', id: '', name: 'Generic', authName: 'generic',
        clientId: '', clientSecret: '',
        icon: '', tags: [],
        saveNewUser: false,
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
        name: new FormControl(model.name, [Validators.required]),
        authName: new FormControl(model.authName, [Validators.required, InputService.hostValidator]),
        discoveryUrl: new FormControl(model.discoveryUrl, [Validators.required, InputService.urlValidator]),
        clientId: new FormControl(model.clientId, [Validators.required]),
        clientSecret: new FormControl(model.clientSecret, [Validators.required]),
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

    return {
      name: '', shortName: '', discoveryUrl: '',
      clientId: '', clientSecret: '',

    };
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


    const nameError = this.formGroup.controls.name.errors;

    if (nameError) {
      if (nameError['required'])
        this.error.name = 'NameRequired';
      else
        this.error.name = 'NameRequired';
    }

    const shortNameError = this.formGroup.controls.authName.errors;

    if (shortNameError) {
      if (shortNameError['required'])
        this.error.shortName = 'ShortNameRequired';
      else if (shortNameError['invalidHost'])
        this.error.shortName = 'InvalidShortName';
      else
        this.error.shortName = 'ShortNameRequired';
    }


    const discoveryUrlError = this.formGroup.controls.discoveryUrl.errors;

    if (discoveryUrlError) {
      if (discoveryUrlError['required'])
        this.error.discoveryUrl = 'DiscoveryUrlRequired';
      else
        this.error.discoveryUrl = 'DiscoveryUrlRequired';
    }

    const clientIdError = this.formGroup.controls.clientId.errors;
    if (clientIdError) {
      if (clientIdError['required'])
        this.error.clientId = 'ClientIdRequired';
      else
        this.error.clientId = 'ClientIdRequired';
    }
    const clientSecretError = this.formGroup.controls.clientSecret.errors;
    if (clientSecretError) {
      if (clientSecretError['required'])
        this.error.clientSecret = 'ClientSecretRequired';
      else
        this.error.clientSecret = 'ClientSecretRequired';
    }



  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.authName != model.authName)
      model.isChanged = true;
    if (original.name != model.name)
      model.isChanged = true;

    if (original.discoveryUrl != model.discoveryUrl)
      model.isChanged = true;
    if (original.clientId != model.clientId)
      model.isChanged = true;
    if (original.clientSecret != model.clientSecret)
      model.isChanged = true;
    if (original.icon != model.icon)
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

  createBaseModel(): BaseOpenId {
    return {
      objId: this.model.objId,
      id: this.model.id,
      baseType: this.model.baseType,
      type: this.model.type,
      name: this.model.name,
      tags: this.model.tags,
      isEnabled: this.model.isEnabled,
      discoveryUrl: this.model.discoveryUrl,
      clientId: this.model.clientId,
      clientSecret: this.model.clientSecret,
      authName: this.model.authName?.toLowerCase().replace(/[^[a-z0-0]]/g, ''),
      icon: this.model.icon,
      saveNewUser: this.model.saveNewUser,
      securityProfile: {
        ...this.model.securityProfile
      }

    }
  }
  saveOrUpdate() {
    if (this.formGroup.valid)
      this.saveOpenId.emit(this.createBaseModel())
  }


  delete() {
    this.deleteOpenId.emit(this.createBaseModel());
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
