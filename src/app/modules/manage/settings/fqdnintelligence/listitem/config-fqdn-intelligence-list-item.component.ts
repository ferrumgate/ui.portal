import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap, takeWhile } from 'rxjs';
import { FileUploadComponent } from 'src/app/modules/shared/fileupload/fileupload.component';
import { FqdnIntelligenceList } from 'src/app/modules/shared/models/fqdnIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { FqdnIntelligenceService } from 'src/app/modules/shared/services/fqdnIntelligence.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

export interface FqdnIntelligenceListExtended extends FqdnIntelligenceList {
  orig: FqdnIntelligenceList;
  isChanged: boolean;
  insertDateStr: string;

}

@Component({
  selector: 'app-config-fqdn-intelligence-list-item',
  templateUrl: './config-fqdn-intelligence-list-item.component.html',
  styleUrls: ['./config-fqdn-intelligence-list-item.component.scss']
})
export class ConfigFqdnIntelligenceListItemComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  _model: FqdnIntelligenceListExtended =
    {
      id: '', name: '', labels: [], isChanged: false, insertDate: '', updateDate: '', http: { checkFrequency: 60, url: 'https://ferrumgate.com' }, insertDateStr: '', isExpanded: false,
      orig: {
        id: '', name: '', labels: [], isChanged: false, insertDate: '', updateDate: '', http: { checkFrequency: 60, url: 'https://ferrumgate.com' }
      }
    };

  get list(): FqdnIntelligenceListExtended {
    return this._model;
  }

  @Input()
  set list(val: FqdnIntelligenceList) {
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
  saveFqdnIntelligenceList: EventEmitter<FqdnIntelligenceList> = new EventEmitter();
  @Output()
  deleteFqdnIntelligenceList: EventEmitter<FqdnIntelligenceList> = new EventEmitter();
  @Output()
  downloadFqdnIntelligenceList: EventEmitter<FqdnIntelligenceList> = new EventEmitter();
  @Output()
  resetFqdnIntelligenceList: EventEmitter<FqdnIntelligenceList> = new EventEmitter();

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
    private ipIntelligenceService: FqdnIntelligenceService,
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
  expand($event: any) {

    this._model.isExpanded = $event
  }

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

  createFormGroup(list: FqdnIntelligenceListExtended) {
    const fmg = new FormGroup({
      name: new FormControl(list.name, [Validators.required]),
      insertDateStr: new FormControl(list.insertDateStr, []),
      splitter: new FormControl(list.splitter, []),
      splitterIndex: new FormControl(list.splitterIndex, []),

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
          if (iterator == 'httpUrl')
            (this._model as any).http.url = x;
          else
            if (iterator == 'httpCheckFrequency')
              (this._model as any).http.checkFrequency = x;
            else
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
    if (this._model.file)
      return this.formGroup.valid && this._model.file.source
    return this.formGroup.valid;
  }

  removeLabel(label: string): void {
    this._model.labels = this._model.labels?.filter(x => x != label);
    if (this.checkFormIsValid())
      this.checkIfModelChanged();
  }

  checkIfModelChanged() {
    this.list.isChanged = false;
    const original = this._model.orig as FqdnIntelligenceList;

    if (original.name != this.list.name)
      this.list.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.list.labels))
      this.list.isChanged = true
    if (original.splitter != this.list.splitter)
      this.list.isChanged = true;
    if (original.splitterIndex != this.list.splitterIndex)
      this.list.isChanged = true;
    if (original.http?.checkFrequency != this.list.http?.checkFrequency)
      this.list.isChanged = true;
    if (original.http?.url != this.list.http?.url)
      this.list.isChanged = true;
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
    const original = this._model.orig as FqdnIntelligenceList;
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
  createBaseModel(fileKey?: string): FqdnIntelligenceList {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      name: this._model.name,
      insertDate: this._model.insertDate,
      updateDate: this._model.updateDate,
      splitter: this._model.splitter,
      splitterIndex: this._model.splitterIndex,
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
                this.saveFqdnIntelligenceList.emit(this.createBaseModel(fileKey));
              }
          })

      ).subscribe();

    } else {
      this.saveFqdnIntelligenceList.emit(this.createBaseModel());
    }
  }

  delete() {
    this.deleteFqdnIntelligenceList.emit(this.createBaseModel());
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
    this.downloadFqdnIntelligenceList.emit(this.createBaseModel());
  }

  reset() {
    this.resetFqdnIntelligenceList.emit(this.createBaseModel());
  }

}
