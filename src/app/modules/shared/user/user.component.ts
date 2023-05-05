import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../models/group';
import { Role } from '../models/rbac';
import { User2 } from '../models/user';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfigService } from '../services/config.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { NotificationService } from '../services/notification.service';
import { SSLCertificate, SSLCertificateBase, SSLCertificateEx } from '../models/sslCertificate';
import { Observable, map, of } from 'rxjs';
import { InputService } from '../services/input.service';

export interface UserExtended extends User2 {
  orig: User2;
  isChanged: boolean;
  //intermediate cert name
  inCertName: string;
  inCertId: string;


}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();
  helpLink = '';
  _model: UserExtended =
    {
      id: '', name: '',
      labels: [], groupIds: [], insertDate: '', updateDate: '',
      source: '', username: '', isChanged: false, isExpanded: false, isLoginMethodsExpanded: false, inCertName: '', inCertId: '',

      orig: {
        id: '', name: '',
        labels: [], groupIds: [], insertDate: '', updateDate: '',
        source: '', username: '',
      }
    };
  /* _groups: Group[] = [];
  @Input()
  set groups(vals: Group[]) {
    //clone 
    this._groups = vals.map(x => {
      return {
        ...x
      }
    })
  }
  get groups() {
    return this._groups;
  } */
  @Input()
  groups: Group[] = [];
  @Input()
  roles: Role[] = [];


  get user(): UserExtended {
    return this._model;
  }

  @Input()
  set user(val: User2) {

    this._model = {

      ...val,
      orig: val,
      labels: Array.from(val.labels || []),
      isChanged: false,
      inCertName: this.inCerts.find(x => x.id == val.cert?.parentId)?.name || '',
      inCertId: this.inCerts.find(x => x.id == val.cert?.parentId)?.id || '',

    }

    this.formGroup = this.createFormGroup(this._model);
  }

  _inCerts: SSLCertificateEx[] = [];

  get inCerts(): SSLCertificateEx[] {
    return this._inCerts;
  }
  @Input()
  set inCerts(value: SSLCertificateEx[]) {
    //empty network for reseting networkId
    this._inCerts = value;
    this.user.inCertName = this._inCerts.find(x => x.id == this.user.cert?.parentId)?.name || ''
    this.prepareCertificatesAutoComplete();
  }
  certfilteredOptions: Observable<SSLCertificateEx[]> = of();

  @Output()
  saveUser: EventEmitter<User2> = new EventEmitter();
  @Output()
  deleteUser: EventEmitter<User2> = new EventEmitter();
  @Output()
  getUserSensitiveData: EventEmitter<User2> = new EventEmitter();

  @Output()
  generateUserApiKey: EventEmitter<User2> = new EventEmitter();
  @Output()
  deleteUserApiKey: EventEmitter<User2> = new EventEmitter();


  @Output()
  generateUserCert: EventEmitter<User2> = new EventEmitter();
  @Output()
  deleteUserCert: EventEmitter<User2> = new EventEmitter();

  @Output()
  resetUserPassword: EventEmitter<{ id: string, objId?: string, password: string }> = new EventEmitter();





  groupFormControl = new FormControl();
  roleFormControl = new FormControl();
  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { name: string, username: string } = { name: '', username: '' }

  isThemeDark = false;
  constructor(
    private route: ActivatedRoute, private clipboard: Clipboard,
    private configService: ConfigService,
    private translateService: TranslationService,
    private notificationService: NotificationService
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.accountUserHelp;
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  prepareCertificatesAutoComplete() {
    this.certfilteredOptions = this.filterCerts('');
  }

  private filterCerts(name: string) {
    const filterValue = name.toLowerCase();
    let items = this.inCerts;
    if (name)
      items = items.filter(x => x.name.toLocaleLowerCase().includes(filterValue));
    return of(items).pipe(
      map(data => {

        data.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        })
        return data;
      })
    )
  }
  searchCert(ev: any) {
    if (typeof (ev) == 'string') {
      this.certfilteredOptions = this.filterCerts(ev);
    }

  }
  displayCertFn(net: SSLCertificateEx | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }

  certChanged(event: any) {
    if (!this.user.cert)
      this.user.cert = this.defaultCertificate();
    if (event?.option?.value) {
      this.user.inCertId = event.option.value.id;
      if (this.user.inCertId)
        this.user.inCertName = event.option.value.name;
      else
        this.user.inCertName = ''

      this.formGroup.controls.inCertName.setValue(this.user.inCertName);
      this.modelChanged();

    } else {
      this.user.inCertId = '';
      this.user.inCertName = '';

      this.formGroup.controls.inCertName.setValue(this.user.inCertName);
      this.modelChanged();
    }


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
    else this.user.isChanged = false;


  }



  createFormGroup(user: User2) {
    const fmg = new FormGroup({
      //name: new FormControl(user.name, [Validators.required]),
      //username: new FormControl(user.username, [Validators.required]),
      inCertName: new FormControl(user.inCertName, []),



    });
    if (user.isNewUser) {
      fmg.addControl('username', new FormControl(user.username, [Validators.required]))
    } else {
      fmg.addControl('name', new FormControl(user.name, [Validators.required]))
    }

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
    //group
    this.groupFormControl = new FormControl();
    const selectedGroups = this.groups.filter(x => user.groupIds.includes(x.id));
    this.groupFormControl.setValue(selectedGroups);
    this.allSub.addThis =
      this.groupFormControl.valueChanges.subscribe(x => {
        this._model.groupIds = (this.groupFormControl.value as any[]).map(x => x.id);
        this.modelChanged();
      })

    //roles
    this.roleFormControl = new FormControl();
    const selectedRoles = this.roles.filter(x => user.roleIds?.includes(x.id));
    this.roleFormControl.setValue(selectedRoles);
    this.allSub.addThis =
      this.roleFormControl.valueChanges.subscribe(x => {
        this._model.roleIds = (this.roleFormControl.value as any[]).map(x => x.id);
        this.modelChanged();

      })
    return fmg;
  }
  createFormError() {
    return { name: '', username: '' };
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this._model.labels?.find(x => x == value);
      if (!isExits) {
        if (!this._model.labels)
          this._model.labels = [];
        this._model.labels.push(value);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this._model.labels = this._model.labels?.filter(x => x != label);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }


  checkIfModelChanged() {
    this.user.isChanged = false;
    const original = this.user.orig as User2;

    if (original.name != this.user.name)
      this.user.isChanged = true;
    if (original.username != this.user.username)
      this.user.isChanged = true;
    if (original.isLocked != this.user.isLocked)
      this.user.isChanged = true;
    if (original.is2FA != this.user.is2FA)
      this.user.isChanged = true;

    if (UtilService.checkChanged(this.user.labels, original.labels))
      this.user.isChanged = true;
    if (UtilService.checkChanged(this.user.roleIds, original.roleIds))
      this.user.isChanged = true;
    if (UtilService.checkChanged(this.user.groupIds, original.groupIds))
      this.user.isChanged = true;


  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();
    if (this.user.isNewUser) {
      const usernameError = this.formGroup.controls.name?.errors;
      if (usernameError) {
        if (usernameError['required'])
          error.username = 'EmailOrUsernameRequired';
        else
          error.username = 'EmailOrUsernameRequired';
      }
    } else {


      const nameError = this.formGroup.controls.name?.errors;

      if (nameError) {
        if (nameError['required'])
          error.name = 'NameRequired';
        else
          error.name = 'NameRequired';
      }
    }





    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as User2;

    this.user = {
      ...original,
      labels: Array.from(original.labels || [])
    }

    this.checkIfModelChanged();
  }
  createBaseModel(): User2 {
    return {
      id: this.user.id,
      objId: this.user.objId,
      labels: Array.from(this.user.labels || []),
      name: this.user.name,
      groupIds: Array.from(this.user.groupIds),
      insertDate: this.user.insertDate,
      updateDate: this.user.updateDate,
      source: this.user.source,
      username: this.user.username,
      apiKey: this.user.apiKey,
      email: this.user.email,
      is2FA: this.user.is2FA,
      isEmailVerified: this.user.isEmailVerified,
      isLocked: this.user.isLocked,
      isVerified: this.user.isVerified,
      roleIds: Array.from(this.user.roleIds || []),
      twoFASecret: this.user.twoFASecret,
      cert: this.user.cert ? { ...this.user.cert } : undefined,
      isNewApiKey: this.user.isNewApiKey,
      isNewUser: this.user.isNewUser

    }
  }
  expand($event: any) {

    this._model.isExpanded = $event
  }

  expandLoginMethod($event: any) {

  }

  userGroupChanged() {

  }


  saveOrUpdate() {

    this.saveUser.emit(this.createBaseModel());
  }



  delete() {
    this.deleteUser.emit(this.createBaseModel());
  }
  generateApiKey() {
    this.generateUserApiKey.emit(this.createBaseModel());
  }

  deleteApiKey() {
    this.deleteUserApiKey.emit(this.createBaseModel());
  }
  copyApiKey() {
    if (this.user.apiKey?.key) {
      this.clipboard.copy(this.user.apiKey.key);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }
  defaultCertificate(): SSLCertificateBase {
    return {


      category: 'auth'
    }
  }

  generateCert() {
    if (!this.user.cert)
      this.user.cert = this.defaultCertificate();
    if (this.user.inCertId)
      this.user.cert.parentId = this.user.inCertId;
    this.generateUserCert.emit(this.createBaseModel());
  }
  deleteCert() {
    this.deleteUserCert.emit(this.createBaseModel());
  }
  copyCert() {
    if (this.user.cert?.publicCrt) {
      this.clipboard.copy(this.user.cert.publicCrt);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

  getSensitiveData() {
    this.getUserSensitiveData.emit(this.createBaseModel());
  }
  copyUserId() {
    if (this.user.id) {
      this.clipboard.copy(this.user.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

  ///////////////////////////////////////
  // reset password section

  resetPassword = { password: '', passwordAgain: '' };
  hideResetPassword = true;
  hideResetPasswordAgain = true;
  resetPasswordError = { password: '', passwordAgain: '' }
  resetPasswordForm = this.createResetPasswordFormGroup();
  createResetPasswordFormGroup() {
    const fmg = new FormGroup(
      {
        password: new FormControl(this.resetPassword.password, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
        passwordAgain: new FormControl(this.resetPassword.passwordAgain, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
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

          (this.resetPassword as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.resetPasswordModelChanged();

      })
    return fmg;
  }

  checkResetPasswordFormError() {
    //check errors 
    this.resetPasswordError = { password: '', passwordAgain: '' }

    const passwordError = this.resetPasswordForm.controls['password'].errors;
    if (passwordError) {

      if (passwordError['required'])
        this.resetPasswordError.password = 'PasswordRequired';
      else if (passwordError['minlength'])
        this.resetPasswordError.password = 'PasswordMinLength';
      else if (passwordError['pattern'])
        this.resetPasswordError.password = 'PasswordPattern';
      else if (passwordError['mismatchedPasswords'])
        this.resetPasswordError.password = 'PasswordsMismatch';
      else
        this.resetPasswordError.password = 'PasswordInvalid';

    }

    const passwordAgainError = this.resetPasswordForm.controls['passwordAgain'].errors;
    if (passwordAgainError) {

      if (passwordAgainError['required'])
        this.resetPasswordError.passwordAgain = 'PasswordAgainRequired';
      else if (passwordAgainError['minlength'])
        this.resetPasswordError.passwordAgain = 'PasswordAgainMinLength';
      else if (passwordAgainError['pattern'])
        this.resetPasswordError.passwordAgain = 'PasswordAgainPattern';
      else if (passwordAgainError['mismatchedPasswords'])
        this.resetPasswordError.passwordAgain = 'PasswordsMismatch';
      else
        this.resetPasswordError.passwordAgain = 'PasswordInvalid';

    }
  }

  resetPasswordModelChanged() {

    this.checkResetPasswordFormError();
  }

  submitResetPassword() {
    if (this.user.id && this.resetPassword.password && this.resetPassword.password == this.resetPassword.passwordAgain)
      this.resetUserPassword.emit({ id: this.user.id, objId: this.user.objId, password: this.resetPassword.password });
  }








}
