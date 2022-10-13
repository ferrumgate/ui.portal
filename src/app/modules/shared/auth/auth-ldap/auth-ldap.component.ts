import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigCaptcha } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { BaseLdap, BaseOAuth } from '../../models/auth';
import { InputService } from '../../services/input.service';
import { SSubscription } from '../../services/SSubscribtion';



interface BaseModel extends BaseLdap {

}
interface Model extends BaseModel {
  isChanged: boolean
  orig: BaseLdap
  svgIcon?: string
}
@Component({
  selector: 'app-auth-ldap',
  templateUrl: './auth-ldap.component.html',
  styleUrls: ['./auth-ldap.component.scss']
})
export class AuthLdapComponent implements OnInit, OnDestroy {
  allSubs = new SSubscription();
  helpLink = '';


  isThemeDark = false;
  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: BaseLdap) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      svgIcon: this.findIconName(val)
    }

    this.formGroup = this.createFormGroup(this._model);

  }

  findIconName(val: BaseLdap) {
    if (val.name.startsWith('Active Directory'))
      return 'social-microsoft';

    return undefined;
  }

  @Output()
  saveLdap: EventEmitter<BaseLdap> = new EventEmitter();
  @Output()
  deleteLdap: EventEmitter<BaseLdap> = new EventEmitter();



  //captcha settings
  formGroup: FormGroup;
  error = {
    host: '', bindDN: '', bindPass: '',
    searchBase: '', searchFilter: '', usernameField: '', groupnameField: ''
  };


  hidePassword = true;
  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this._model = {

      baseType: 'ldap', type: 'activedirectory', id: '', name: 'Active Directory',
      host: '', groupnameField: '', searchBase: '', usernameField: '', bindDN: '', bindPass: '',
      searchFilter: '',
      isEnabled: true,
      isChanged: false,
      orig: {
        baseType: 'ldap', type: 'activedirectory', id: '', name: 'Active Directory',
        host: '', groupnameField: '', searchBase: '', usernameField: '', bindDN: '', bindPass: '',
        searchFilter: '',
        isEnabled: true
      }

    };
    this.formGroup = this.createFormGroup(this.model);

    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.authLdapHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }


  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        host: new FormControl(model.host, [Validators.required]),
        bindDN: new FormControl(model.bindDN, [Validators.required]),
        bindPass: new FormControl(model.bindPass, [Validators.required]),
        searchBase: new FormControl(model.searchBase, [Validators.required]),
        searchFilter: new FormControl(model.searchFilter, []),
        usernameField: new FormControl(model.usernameField, [Validators.required]),
        groupnameField: new FormControl(model.groupnameField, [Validators.required])

      });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSubs.addThis =
        fm.valueChanges.subscribe(x => {
          (this._model as any)[iterator] = x;
        })
    }
    this.allSubs.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;
  }

  resetErrors() {

    return {
      host: '', bindDN: '', bindPass: '',
      searchBase: '', searchFilter: '', usernameField: '', groupnameField: ''
    }
  }

  modelChanged($event?: any) {

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

    const bindDNError = this.formGroup.controls.bindDN.errors;
    if (bindDNError) {
      if (bindDNError['required'])
        this.error.bindDN = 'BindDNRequired';
      else
        this.error.bindDN = 'BindDNRequired';
    }

    const bindPassError = this.formGroup.controls.bindPass.errors;
    if (bindPassError) {
      if (bindPassError['required'])
        this.error.bindPass = 'BindPassRequired';
      else
        this.error.bindPass = 'BindPassRequired';
    }

    const searchBaseError = this.formGroup.controls.searchBase.errors;
    if (searchBaseError) {
      if (searchBaseError['required'])
        this.error.searchBase = 'UserSearchBasePathRequired';
      else
        this.error.searchBase = 'UserSearchBasePathRequired';
    }
    const usernameFieldError = this.formGroup.controls.usernameField.errors;
    if (usernameFieldError) {
      if (usernameFieldError['required'])
        this.error.usernameField = 'UsernameFieldRequired';
      else
        this.error.usernameField = 'UsernameFieldRequired';
    }

    const groupnameFieldError = this.formGroup.controls.groupnameField.errors;
    if (groupnameFieldError) {
      if (groupnameFieldError['required'])
        this.error.groupnameField = 'GroupnameFieldRequired';
      else
        this.error.groupnameField = 'GroupnameFieldRequired';
    }


  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.host != model.host)
      model.isChanged = true;
    if (original.bindDN != model.bindDN)
      model.isChanged = true;
    if (original.bindPass != model.bindPass)
      model.isChanged = true;

    if (original.searchBase != model.searchBase)
      model.isChanged = true;
    if (original.searchFilter != model.searchFilter)
      model.isChanged = true;
    if (original.usernameField != model.usernameField)
      model.isChanged = true;
    if (original.groupnameField != model.groupnameField)
      model.isChanged = true;

    if (original.allowedGroups?.length || 0 != model.allowedGroups?.length || 0)
      model.isChanged = true;
    if (original.isEnabled != model.isEnabled)
      model.isChanged = true;

    for (const item of original.allowedGroups || []) {
      if (model.allowedGroups && !model.allowedGroups?.find(x => x == item))
        model.isChanged = true;
    }

    for (const item of model.allowedGroups || []) {
      if (original.allowedGroups && !original.allowedGroups?.find(x => x == item))
        model.isChanged = true;
    }

  }


  clear() {

    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;
    this.formGroup.markAsUntouched();
  }

  createBaseModel(): BaseLdap {
    return {
      objId: this.model.objId,
      id: this.model.id,
      baseType: this.model.baseType,
      type: this.model.type,
      name: this.model.name,
      tags: this.model.tags,
      groupnameField: this.model.groupnameField,
      host: this.model.host,
      searchBase: this.model.searchBase,
      searchFilter: this.model.searchFilter,
      usernameField: this.model.usernameField,
      bindDN: this.model.bindDN,
      bindPass: this.model.bindPass,
      allowedGroups: this.model.allowedGroups,
      isEnabled: this.model.isEnabled,
      securityProfile: {
        ...this.model.securityProfile
      }

    }
  }
  saveOrUpdate() {
    if (this.formGroup.valid)
      this.saveLdap.emit(this.createBaseModel())
  }


  delete() {
    this.deleteLdap.emit(this.createBaseModel());
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addGroup(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our
    if (value) {
      const isExits = this.model.allowedGroups?.find(x => x == value);
      if (!isExits) {
        if (!this.model.allowedGroups) this.model.allowedGroups = [];
        this.model.allowedGroups.push(value);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeGroup(label: string): void {
    this.model.allowedGroups = this.model.allowedGroups?.filter(x => x != label) || [];
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

}
