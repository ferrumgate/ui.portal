import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigEmail, ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceSource } from 'src/app/modules/shared/models/ipIntelligence';
import { SSLCertificate, SSLCertificateEx } from 'src/app/modules/shared/models/sslCertificate';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { PKIService } from 'src/app/modules/shared/services/pki.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Clipboard } from '@angular/cdk/clipboard';

interface SSLCertificateExtended extends SSLCertificate {
  orig: SSLCertificate;
  isChanged: boolean;
  insertDateStr: string;
  updateDateStr: string;


}

@Component({
  selector: 'app-config-pki-web',
  templateUrl: './config-pki-web.component.html',
  styleUrls: ['./config-pki-web.component.scss']
})
export class ConfigPKIWebComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  _model: SSLCertificateExtended =
    {
      id: '', name: '', labels: [], isChanged: false, insertDate: '', usages: [],
      category: 'web',
      updateDate: '', insertDateStr: '', updateDateStr: '', isExpanded: false, isEnabled: true,
      orig: {
        idEx: '', name: '', labels: [], isChanged: false, insertDate: '', updateDate: '',
        isEnabled: true, category: 'web', isIntermediate: true, usages: []
      }
    };


  get cert(): SSLCertificateExtended {
    return this._model;
  }

  @Input()
  set cert(val: SSLCertificate) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      labels: Array.from(val.labels || []),
      insertDateStr: UtilService.dateFormatToLocale(new Date(val.insertDate)),
      updateDateStr: UtilService.dateFormatToLocale(new Date(val.updateDate)),




    }

    this.formGroup = this.createFormGroup(this._model);
  }

  @Output()
  saveCert: EventEmitter<SSLCertificate> = new EventEmitter();
  @Output()
  deleteCert: EventEmitter<SSLCertificate> = new EventEmitter();



  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: {
    name: string, publicCrt: string;
  }
    = { name: '', publicCrt: '' };


  isThemeDark = false;

  constructor(
    private route: ActivatedRoute, private clipboard: Clipboard,
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

    this.helpLink = this.configService.links.pkiHelp;
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
    else this.cert.isChanged = false;


  }



  createFormGroup(cert: SSLCertificateExtended) {
    const fmg = new FormGroup({
      name: new FormControl(cert.name, [Validators.required]),
      updateDateStr: new FormControl(cert.updateDateStr, []),
      publicCrt: new FormControl(cert.publicCrt, []),
      privateKey: new FormControl(cert.privateKey, []),

    });
    fmg.controls['updateDateStr'].disable();



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

    return { name: '', publicCrt: '' };
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
    this.cert.isChanged = false;
    const original = this._model.orig as SSLCertificateEx;

    if (original.name != this.cert.name)
      this.cert.isChanged = true;
    if (original.isEnabled != this.cert.isEnabled)
      this.cert.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.cert.labels))
      this.cert.isChanged = true
    if (original.publicCrt != this.cert.publicCrt)
      this.cert.isChanged = true;


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
    const original = this._model.orig as SSLCertificateEx;
    this.cert = {
      ...original,
      labels: Array.from(original.labels || []),

    }


    this.checkIfModelChanged();
  }
  createBaseModel(): SSLCertificate {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      usages: Array.from(this._model.usages || []),
      name: this._model.name,
      insertDate: this._model.insertDate,
      updateDate: this._model.updateDate,
      isEnabled: this._model.isEnabled,
      category: this._model.category,
      idEx: this._model.idEx,

    }
  }


  saveOrUpdate() {
    const model = this.createBaseModel();
    model.publicCrt = this._model.publicCrt?.replace(/^\n+|\n+$/gm, '');
    model.privateKey = this._model.privateKey?.replace(/^\n+|\n+$/gm, '');
    this.saveCert.emit(model);
  }

  delete() {
    this.deleteCert.emit(this.createBaseModel());
  }

  copyCert() {
    if (this.cert.publicCrt) {
      this.clipboard.copy(this.cert.publicCrt);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }




}
