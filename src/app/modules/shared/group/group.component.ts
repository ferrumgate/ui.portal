import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../models/group';
import { SSubscription } from '../services/SSubscribtion';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';

export interface GroupExtended extends Group {
  orig: Group;
  isChanged: boolean;
  isUsersOpened: boolean;
  usersLength: number;

}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _model: GroupExtended =
    {
      id: '', name: '', labels: [], isChanged: false,
      isUsersOpened: false, usersLength: 0, isEnabled: true,
      orig: {
        id: '', name: '', labels: [], isEnabled: true
      }
    };

  get group(): GroupExtended {
    return this._model;
  }

  @Input()
  set group(val: Group) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      labels: Array.from(val.labels),
      isUsersOpened: val.isUsersOpened,
      usersLength: val.usersLength
    }

    this.formGroup = this.createFormGroup(this._model);
  }

  @Output()
  saveGroup: EventEmitter<Group> = new EventEmitter();
  @Output()
  deleteGroup: EventEmitter<Group> = new EventEmitter();

  @Output()
  openGroupUsers: EventEmitter<Group> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { name: string } = { name: '' }

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

    this.helpLink = this.configService.links.accountGroupHelp;
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
    else this.group.isChanged = false;

  }

  createFormGroup(group: Group) {
    const fmg = new FormGroup({
      name: new FormControl(group.name, [Validators.required]),

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
    return { name: '' };
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this._model.labels.find(x => x == value);
      if (!isExits)
        this._model.labels.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this._model.labels = this._model.labels.filter(x => x != label);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

  checkIfModelChanged() {
    this.group.isChanged = false;
    const original = this._model.orig as Group;

    if (original.name != this.group.name)
      this.group.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.group.labels))
      this.group.isChanged = true;

    if (original.isEnabled != this.group.isEnabled)
      this.group.isChanged = true;

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
    const original = this._model.orig as Group;

    this.group = {
      ...original,
      labels: Array.from(original.labels)
    }

    this.checkIfModelChanged();
  }
  createBaseModel(): Group {
    return {
      id: this._model.id, objId: this._model.objId, labels: Array.from(this._model.labels), name: this._model.name, isEnabled: this._model.isEnabled
    }
  }

  saveOrUpdate() {

    this.saveGroup.emit(this.createBaseModel());
  }

  delete() {
    this.deleteGroup.emit(this.createBaseModel());
  }

  openUsersClicked() {
    this._model.isUsersOpened = !this._model.isUsersOpened;
    this.openGroupUsers.emit(this.createBaseModel());
  }
  copyGroupId() {
    if (this.group.id) {
      this.clipboard.copy(this.group.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

}
