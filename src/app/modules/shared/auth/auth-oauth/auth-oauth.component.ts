import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigCaptcha } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { BaseOAuth } from '../../models/auth';
import { SSubscription } from '../../services/SSubscribtion';


interface BaseModel extends BaseOAuth {

}
interface Model extends BaseModel {
  isChanged: boolean
  orig: BaseOAuth
  svgIcon?: string
}

@Component({
  selector: 'app-auth-oauth',
  templateUrl: './auth-oauth.component.html',
  styleUrls: ['./auth-oauth.component.scss']
})
export class AuthOauthComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';


  isThemeDark = false;
  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: BaseOAuth) {
    this._model = {
      ...val,
      clientId: val.clientId,
      clientSecret: val.clientSecret,
      isChanged: false,
      orig: val,
      svgIcon: this.findIconName(val)
    }
    this.formGroup = this.createFormGroup(this._model);
  }
  findIconName(val: BaseOAuth) {
    if (val.name.startsWith('Google'))
      return 'social-google';
    if (val.name.startsWith('Linkedin'))
      return 'social-linkedin'
    return undefined;
  }

  @Output()
  saveOAuth: EventEmitter<BaseOAuth> = new EventEmitter();
  @Output()
  deleteOAuth: EventEmitter<BaseOAuth> = new EventEmitter();



  //captcha settings
  formGroup: FormGroup;
  error = { clientId: '', clientSecret: '' };
  captchaError: { server: string, client: string } = { server: '', client: '' };
  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this._model = {
      clientId: '', clientSecret: '',
      baseType: 'oauth', type: 'google', id: '', name: 'OAuth',
      isChanged: false, isEnabled: true,
      orig:
      {
        clientId: '', clientSecret: '',
        baseType: 'oauth', type: 'google', id: '', name: 'OAuth',
        isEnabled: true

      }
    };
    this.formGroup = this.createFormGroup(this.model);

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.authOauthHelp;

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
      clientId: '', clientSecret: ''
    }
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
    const clientIdError = this.formGroup.controls['clientId'].errors;

    if (clientIdError) {
      if (clientIdError['required'])
        this.error.clientId = 'ClientIdRequired';
      else
        this.error.clientId = 'ClientIdRequired';
    }

    const clientSecretError = this.formGroup.controls['clientSecret'].errors;

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
    if (original.clientId != model.clientId)
      model.isChanged = true;
    if (original.clientSecret != model.clientSecret)
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

  createBaseModel(): BaseOAuth {
    return {
      objId: this.model.objId,
      id: this.model.id,
      baseType: this.model.baseType,
      type: this.model.type,
      clientId: this.model.clientId,
      clientSecret: this.model.clientSecret,
      name: this.model.name,
      tags: this.model.tags,
      isEnabled: this.model.isEnabled,
      saveNewUser: this.model.saveNewUser,
      securityProfile: {
        ...this.model.securityProfile
      }

    }
  }
  saveOrUpdate() {
    if (this.formGroup.valid)
      this.saveOAuth.emit(this.createBaseModel())
  }


  delete() {
    this.deleteOAuth.emit(this.createBaseModel());
  }

}
