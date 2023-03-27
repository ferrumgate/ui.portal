import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

import { map, Observable, of, switchMap, takeWhile } from 'rxjs';
import { FileUploadComponent } from 'src/app/modules/shared/fileupload/fileupload.component';
import { IpIntelligence, IpIntelligenceList } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';



export interface IpIntelligenceListExtended extends IpIntelligenceList {
  orig: IpIntelligenceList;
  isChanged: boolean;
  insertDateStr: string;


}

@Component({
  selector: 'app-config-ip-intelligence-list-item',
  templateUrl: './config-ip-intelligence-list-item.component.html',
  styleUrls: ['./config-ip-intelligence-list-item.component.scss']
})
export class ConfigIpIntelligenceListItemComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  _model: IpIntelligenceListExtended =
    {
      id: '', name: '', labels: [], isChanged: false, insertDate: '', updateDate: '', http: { checkFrequency: 1, url: 'https://ferrumgate.com' }, insertDateStr: '',
      orig: {
        id: '', name: '', labels: [], isChanged: false, insertDate: '', updateDate: '', http: { checkFrequency: 1, url: 'https://ferrumgate.com' }
      }
    };


  get list(): IpIntelligenceListExtended {
    return this._model;
  }

  @Input()
  set list(val: IpIntelligenceList) {
    this._model = {
      ...val,
      http: val.http ? { ...val.http } : undefined,
      file: val.file ? { ...val.file } : undefined,
      isChanged: false,
      orig: val,
      labels: Array.from(val.labels || []),
      insertDateStr: UtilService.dateFormatToLocale(new Date(val.insertDate))

    }

    this.formGroup = this.createFormGroup(this._model);
  }

  @Output()
  saveIpIntelligenceList: EventEmitter<IpIntelligenceList> = new EventEmitter();
  @Output()
  deleteIpIntelligenceList: EventEmitter<IpIntelligenceList> = new EventEmitter();
  @Output()
  downloadIpIntelligenceList: EventEmitter<IpIntelligenceList> = new EventEmitter();
  @Output()
  resetIpIntelligenceList: EventEmitter<IpIntelligenceList> = new EventEmitter();



  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: {
    name: string, httpUrl: string,
    fileSource: string,
  }
    = { name: '', httpUrl: '', fileSource: '' };


  isThemeDark = false;

  @ViewChild(FileUploadComponent) fileupload!: FileUploadComponent;

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private ipIntelligenceService: IpIntelligenceService,
    private confirmService: ConfirmService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.ipIntelligenceHelp;
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  testForm = new FormControl();


  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }
  modelChanged() {

    this.checkFormError();
    if (this.checkFormIsValid())
      this.checkIfModelChanged();
    else this.list.isChanged = false;


  }



  createFormGroup(list: IpIntelligenceListExtended) {
    const fmg = new FormGroup({
      name: new FormControl(list.name, [Validators.required]),
      insertDateStr: new FormControl(list.insertDateStr, []),



    });
    fmg.controls['insertDateStr'].disable();

    if (list.http) {
      fmg.addControl('httpUrl', new FormControl(list.http.url, [Validators.required, InputService.urlValidator]))
      fmg.addControl('httpCheckFrequency', new FormControl(list.http.checkFrequency, [Validators.required, Validators.min(1)]))
    }
    /* if (list.file) {
      fmg.addControl('fileSource', new FormControl(list.file.source, [Validators.required]))
    } */
    if (list.status) {
      fmg.addControl('statusLastCheck', new FormControl(list.status.lastCheck));
      fmg.controls['statusLastCheck'].disable();
      fmg.addControl('statusLastError', new FormControl(list.status.lastError));
      fmg.controls['statusLastError'].disable();

      fmg.addControl('statusLastSuccess', new FormControl(list.status.lastStatus));
      fmg.controls['statusLastError'].disable();

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
    return fmg;
  }
  createFormError() {

    return { name: '', httpUrl: '', fileSource: '' };
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
    if (this.checkFormIsValid())
      this.checkIfModelChanged();
  }
  checkFormIsValid() {
    return this.formGroup.valid && this._model.file && this._model.file.source
  }

  removeLabel(label: string): void {
    this._model.labels = this._model.labels?.filter(x => x != label);
    if (this.checkFormIsValid())
      this.checkIfModelChanged();
  }


  checkIfModelChanged() {
    this.list.isChanged = false;
    const original = this._model.orig as IpIntelligenceList;

    if (original.name != this.list.name)
      this.list.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.list.labels))
      this.list.isChanged = true
    if (this.uploadFile)
      this.list.isChanged = true;

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

    if (this.list.http) {
      const urlError = this.formGroup.controls.httpUrl.errors;

      if (urlError) {
        if (urlError['required'])
          error.httpUrl = 'UrlRequired';
        else
          error.httpUrl = 'UrlInvalid';
      }
    }
    if (this.list.file) {
      if (!this.list.file.source) {
        error.fileSource = 'FileRequired';

      }


    }


    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as IpIntelligenceList;
    this.list = {
      ...original,
      http: original.http ? { ...original.http } : undefined,
      file: original.file ? { ...original.file } : undefined,
      labels: Array.from(original.labels || [])
    }
    this.uploadFile = null;
    this.fileupload.file = null;
    this.checkIfModelChanged();
  }
  createBaseModel(fileKey?: string): IpIntelligenceList {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      name: this._model.name,
      insertDate: this._model.insertDate,
      updateDate: this._model.updateDate,
      file: this._model.file,
      http: this._model.http,
      uploadFile: this.uploadFile,
      fileKey: fileKey
    }
  }


  saveOrUpdate() {
    if (this.uploadFile) {

      this.confirmService.showSave().pipe(
        takeWhile(x => x),
        switchMap(y => this.uploadFile ? this.ipIntelligenceService.uploadListFile(this.uploadFile) : of()),
        map(
          event => {

            if (event.type == HttpEventType.UploadProgress) {
              if (event.total)
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            } else
              if (event.type == HttpEventType.Response) {
                this.notificationService.success(this.translateService.translate('FileUploadedSuccessfuly'))
                let fileKey = (event.body as any).key;
                this.saveIpIntelligenceList.emit(this.createBaseModel(fileKey));
              }
          })

      ).subscribe();

    } else {
      this.saveIpIntelligenceList.emit(this.createBaseModel());
    }
  }



  delete() {
    this.deleteIpIntelligenceList.emit(this.createBaseModel());
  }
  uploadFile: File | null = null;
  @Input()
  uploadProgress = 0;
  restore(file: File) {

    this.uploadFile = file;
    if (this._model.file) {
      this._model.file.source = file.name;
      this.modelChanged();
    }


  }

  download() {
    this.downloadIpIntelligenceList.emit(this.createBaseModel());
  }

  reset() {
    this.resetIpIntelligenceList.emit(this.createBaseModel());
  }



}
