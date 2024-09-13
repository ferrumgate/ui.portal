import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import * as diff from 'deep-object-diff';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { DevicePosture } from '../models/device';
import { SSubscription } from '../services/SSubscribtion';
import { UtilService } from '../services/util.service';

interface Model extends DevicePosture {
  isChanged: boolean
  orig: DevicePosture
  svgIcon: string;
  objId?: string;
  macs?: string;
  serials?: string;

}
@Component({
  selector: 'app-deviceposture',
  templateUrl: './deviceposture.component.html',
  styleUrls: ['./deviceposture.component.scss']
})
export class DevicePostureComponent implements OnInit, OnDestroy {
  allSubs = new SSubscription();
  helpLink = '';

  isThemeDark = false;
  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: DevicePosture) {
    this._model = {
      ...val,
      isChanged: false,
      isExpanded: val.isExpanded,
      orig: JSON.parse(JSON.stringify(val)),
      svgIcon: this.findIconName(val),
      macs: val.macList ? val.macList.map(x => x.value).join(', ') : '',
      serials: val.serialList ? val.serialList.map(y => y.value).join(', ') : ''
    }

    this.formGroup = this.createFormGroup(this._model);

  }

  findIconName(val: DevicePosture) {
    if (val.os == 'win32')
      return 'windows';
    if (val.os == 'darwin')
      return 'apple';
    if (val.os == 'linux')
      return 'linux';

    return 'linux';
  }

  @Output()
  saveDevicePosture: EventEmitter<DevicePosture> = new EventEmitter();
  @Output()
  deleteDevicePosture: EventEmitter<DevicePosture> = new EventEmitter();

  //captcha settings
  formGroup: FormGroup;
  error = {
    name: '',
  };

  hidePassword = true;
  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this._model = {

      id: '', insertDate: new Date().toISOString(),
      isChanged: false, isEnabled: true, labels: [], name: '',
      os: 'win32', svgIcon: 'windows', updateDate: new Date().toISOString(),
      isExpanded: true,
      orig: {
        id: '', insertDate: new Date().toISOString(), isEnabled: true, labels: [],
        name: '', os: 'win32', updateDate: new Date().toISOString(),
      }

    };
    this.formGroup = this.createFormGroup(this.model);

    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.devicePostureHelp;

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

  createFormGroup(model: Model) {

    const fmg = new FormGroup(
      {
        name: new FormControl(model.name, [Validators.required]),

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
      name: '',
    }
  }

  modelChanged($event?: any) {
    this.model.macList = this.model.macs ? this.model.macs.split(',').map(x => x.trim()).filter(y => y).map(x => {
      return {
        value: x
      }
    }) : undefined;
    this.model.serialList = this.model.serials ? this.model.serials?.split(',').map(x => x.trim()).filter(y => y).map(x => {
      return {
        value: x
      }
    }) : undefined;
    //console.log(this.model);

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

  }

  isChanged(a: any, b: any) {
    const diffFields2 = diff.diff(a || [], b || []);
    if (a == undefined && b == undefined) return false;
    if (a == undefined && b && Array.isArray(b) && !b.length) return false;
    if (a == undefined && b && Array.isArray(b) && b.length) return true;
    if (b == undefined && a && Array.isArray(a) && !a.length) return false;
    if (b == undefined && a && Array.isArray(a) && a.length) return true;

    const diffFields = diff.detailedDiff(a, b);
    let keyLength = 0;
    if (diffFields.added)
      keyLength += Object.keys(diffFields.added).length;
    if (diffFields.deleted)
      keyLength += Object.keys(diffFields.deleted).length;
    if (diffFields.updated)
      keyLength += Object.keys(diffFields.updated).length
    return keyLength > 0 ? true : false
  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.name != model.name)
      model.isChanged = true;

    if (original.isEnabled != model.isEnabled)
      model.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.model.labels))
      this.model.isChanged = true
    if (this.isChanged(original.antivirusList, model.antivirusList?.filter(x => x.name)))
      this.model.isChanged = true;
    if (this.isChanged(original.clientVersions, model.clientVersions?.filter(x => x.version)))
      this.model.isChanged = true;
    if (original.discEncryption != model.discEncryption)
      this.model.isChanged = true;
    if (this.isChanged(original.filePathList, model.filePathList?.filter(y => y.path || y.sha256 || y.fingerprint)))
      this.model.isChanged = true;
    if (this.isChanged(original.firewallList, model.firewallList?.filter(x => x.name)))
      this.model.isChanged = true;
    if (this.isChanged(original.macList, model.macList?.filter(y => y.value)))
      this.model.isChanged = true;
    if (this.isChanged(original.osVersions, model.osVersions?.filter(y => y.name || y.release)))
      this.model.isChanged = true;
    if (this.isChanged(original.processList, model.processList?.filter(y => y.path || y.fingerprint || y.sha256)))
      this.model.isChanged = true;
    if (this.isChanged(original.registryList, model.registryList?.filter(x => x.path || x.key || x.value)))
      this.model.isChanged = true;
    if (this.isChanged(original.serialList, model.serialList?.filter(x => x.value)))
      this.model.isChanged = true;

  }

  clear() {

    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;
    this.formGroup.markAsUntouched();
  }

  createDevicePosture(): DevicePosture {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      name: this._model.name,
      isEnabled: this._model.isEnabled,
      insertDate: this.model.insertDate,
      os: this.model.os,
      updateDate: this.model.updateDate,
      antivirusList: this._model.antivirusList?.map(x => { return { name: x.name?.trim() } }).filter(x => x.name),
      clientVersions: this._model.clientVersions?.map(x => { return { version: x.version?.trim() } }).filter(x => x.version),
      filePathList: this._model.filePathList?.map(x => { return { path: x.path?.trim(), fingerprint: x.fingerprint, sha256: x.sha256 } }).filter(x => x.path),
      firewallList: this._model.firewallList?.map(x => { return { name: x.name?.trim() } }).filter(y => y.name),
      discEncryption: this._model.discEncryption,
      macList: this._model.macList?.map(x => { return { value: x.value?.trim() } }).filter(x => x.value),
      osVersions: this._model.osVersions?.map(x => { return { name: x.name?.trim(), release: x.release } }).filter(y => y.name),
      processList: this._model.processList?.map(x => { return { path: x.path?.trim(), fingerprint: x.fingerprint, sha256: x.sha256 } }).filter(x => x.path),
      registryList: this._model.registryList?.map(x => { return { path: x.path?.trim(), key: x.key, value: x.value } }).filter(x => x.path),
      serialList: this._model.serialList?.map(x => { return { value: x.value?.trim() } }).filter(y => y.value),

    }

  }
  saveOrUpdate() {
    if (this.formGroup.valid)
      this.saveDevicePosture.emit(this.createDevicePosture())
  }

  delete() {
    this.deleteDevicePosture.emit(this.createDevicePosture());
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
        this._model.labels?.push(value);
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

  addAntivirusCheck() {
    if (this.model.antivirusList?.length) return;
    this.model.antivirusList = [{
      name: 'general'
    }]
    this.modelChanged();
  }
  removeAntivirusCheck() {
    delete this.model.antivirusList;
    this.modelChanged();
  }

  addFirewallCheck() {
    if (this.model.firewallList?.length) return;
    this.model.firewallList = [{
      name: 'general'
    }]
    this.modelChanged();
  }
  removeFirewallCheck() {
    delete this.model.firewallList;
    this.modelChanged();
  }

  addDiscEncryptedCheck() {
    this.model.discEncryption = true;
    this.modelChanged();

  }
  removeDiscEncryptedCheck() {
    delete this.model.discEncryption;
    this.modelChanged();
  }

  addClientVersion() {
    if (this.model.clientVersions?.length) return;
    this.model.clientVersions = [
      { version: '' }
    ]
    this.modelChanged();
  }

  removeClientVersion() {
    delete this.model.clientVersions;
    this.modelChanged();
  }

  addOsVersion() {
    if (this.model.osVersions?.length) return;
    this.model.osVersions = [
      { name: 'osname', release: '' }
    ]
    this.modelChanged();
  }

  removeOsVersion() {
    delete this.model.osVersions;
    this.modelChanged();
  }

  addMac() {
    if (!this.model.macList)
      this.model.macList = [];
    this.model.macList.push({ value: '' })
    this.model.macs = '';
    this.model.macAdded = true;
    this.modelChanged();
  }
  removeMac() {
    delete this.model.macList;
    this.model.macs = '';
    this.model.macAdded = false;
    this.modelChanged();
  }

  addSerial() {
    if (!this.model.serialList)
      this.model.serialList = [];
    this.model.serialList.push({ value: '' })
    this.model.serials = '';
    this.model.serialAdded = true;
    this.modelChanged();
  }
  removeSerial() {
    delete this.model.serialList;
    this.model.serials = '';
    this.model.serialAdded = false;
    this.modelChanged();
  }

  addFileCheck() {
    if (!this.model.filePathList)
      this.model.filePathList = [];
    this.model.filePathList.push({ path: '', sha256: '' })
    this.modelChanged();

  }
  removeFileCheck($event: any) {
    let index = this.model.filePathList?.findIndex(x => x == $event);
    if (index != null && index >= 0)
      this.model.filePathList?.splice(index, 1);
    this.modelChanged();
  }
  addProcessCheck() {
    if (!this.model.processList)
      this.model.processList = [];
    this.model.processList.push({ path: '', sha256: '' })
    this.modelChanged();

  }
  removeProcessCheck($event: any) {
    let index = this.model.processList?.findIndex(x => x == $event);
    if (index != null && index >= 0)
      this.model.processList?.splice(index, 1);
    this.modelChanged();
  }

  addRegistryCheck() {
    if (!this.model.registryList)
      this.model.registryList = [];
    this.model.registryList.push({ path: '', key: '' })

  }
  removeRegistryCheck($event: any) {
    let index = this.model.registryList?.findIndex(x => x == $event);
    if (index != null && index >= 0)
      this.model.registryList?.splice(index, 1);
    this.modelChanged();
  }

}
