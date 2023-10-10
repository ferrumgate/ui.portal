import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigCaptcha } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { BaseRadius } from '../../models/auth';
import { SSubscription } from '../../services/SSubscribtion';
import { InputService } from '../../services/input.service';


interface BaseModel extends BaseRadius {

}
interface Model extends BaseModel {
  isChanged: boolean
  orig: BaseRadius
  svgIcon?: string
}

@Component({
  selector: 'app-auth-radius',
  templateUrl: './auth-radius.component.html',
  styleUrls: ['./auth-radius.component.scss']
})
export class AuthRadiusComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  hidePassword = true;
  isThemeDark = false;
  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: BaseRadius) {
    this._model = {
      ...val,
      host: val.host,
      secret: val.secret,
      isChanged: false,
      orig: val,
      svgIcon: this.findIconName(val)
    }
    this.formGroup = this.createFormGroup(this._model);
  }
  findIconName(val: BaseRadius) {

    return "radius";
  }

  @Output()
  saveRadius: EventEmitter<BaseRadius> = new EventEmitter();
  @Output()
  deleteRadius: EventEmitter<BaseRadius> = new EventEmitter();



  //captcha settings
  formGroup: FormGroup;
  error = { host: '', };
  captchaError: { server: string, client: string } = { server: '', client: '' };
  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this._model = {
      host: '', secret: '',
      baseType: 'radius', type: 'generic', id: '', name: 'Radius',
      isChanged: false, isEnabled: true, saveNewUser: true,
      orig:
      {
        host: '', secret: '',
        baseType: 'radius', type: 'generic', id: '', name: 'Radius',
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
        host: new FormControl(model.host, [Validators.required, InputService.hostValidator]),
        secret: new FormControl(model.secret),
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
      host: '', secret: ''
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
    const hostError = this.formGroup.controls.host.errors;

    if (hostError) {
      if (hostError['required'])
        this.error.host = 'HostRequired';
      else
        this.error.host = 'HostRequired';
    }


  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.host != model.host)
      model.isChanged = true;
    if (original.secret != model.secret)
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

  createBaseModel(): BaseRadius {
    return {
      objId: this.model.objId,
      id: this.model.id,
      baseType: this.model.baseType,
      type: this.model.type,
      host: this.model.host,
      secret: this.model.secret,
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
      this.saveRadius.emit(this.createBaseModel())
  }


  delete() {
    this.deleteRadius.emit(this.createBaseModel());
  }

}
