import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../models/group';
import { Role } from '../models/rbac';
import { User2 } from '../models/user';
import { ConfigService } from '../services/config.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';

export interface UserExtended extends User2 {
  orig: User2;
  isChanged: boolean;



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
      source: '', username: '', isChanged: false,

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


    }

    this.formGroup = this.createFormGroup(this._model);
  }


  @Output()
  saveUser: EventEmitter<User2> = new EventEmitter();
  @Output()
  deleteUser: EventEmitter<User2> = new EventEmitter();



  groupFormControl = new FormControl();
  roleFormControl = new FormControl();
  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { name: string, email: string } = { name: '', email: '' }

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

    this.helpLink = this.configService.links.accountUserHelp;
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
    else this.user.isChanged = false;


  }



  createFormGroup(user: User2) {
    const fmg = new FormGroup({
      name: new FormControl(user.name, [Validators.required]),


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
    return { name: '', email: '' };
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

    const nameError = this.formGroup.controls.name.errors;

    if (nameError) {
      if (nameError['required'])
        error.name = 'NameRequired';
      else
        error.name = 'NameRequired';
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
      isOnlyApiKey: this.user.isOnlyApiKey,
      isVerified: this.user.isVerified,
      roleIds: Array.from(this.user.roleIds || []),
      twoFASecret: this.user.twoFASecret

    }
  }

  userGroupChanged() {

  }


  saveOrUpdate() {

    this.saveUser.emit(this.createBaseModel());
  }



  delete() {
    this.deleteUser.emit(this.createBaseModel());
  }








}
