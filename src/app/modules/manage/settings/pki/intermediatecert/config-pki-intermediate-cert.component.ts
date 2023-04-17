import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

import { map, Observable, of, switchMap, takeWhile } from 'rxjs';
import { SSLCertificate, SSLCertificateEx } from 'src/app/modules/shared/models/sslCertificate';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { PKIService } from 'src/app/modules/shared/services/pki.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Clipboard } from '@angular/cdk/clipboard';

export interface KeyValue {
  id: string; value: string
}


interface SSLCertificateExExtended extends SSLCertificateEx {
  orig: SSLCertificateEx;
  isChanged: boolean;
  insertDateStr: string;


}

@Component({
  selector: 'app-config-pki-intermediate-cert',
  templateUrl: './config-pki-intermediate-cert.component.html',
  styleUrls: ['./config-pki-intermediate-cert.component.scss']
})
export class ConfigPKIIntermediateCertComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();
  helpLink = '';

  _model: SSLCertificateExExtended =
    {
      id: '', name: '', labels: [], isChanged: false, insertDate: '',
      updateDate: '', insertDateStr: '', isExpanded: false, isEnabled: true, usages: [],
      orig: {
        id: '', name: '', labels: [], isChanged: false, insertDate: '', updateDate: '',
        isEnabled: true, category: 'auth', isIntermediate: true, usages: []
      }
    };


  get cert(): SSLCertificateExExtended {
    return this._model;
  }

  usageFormControl = new FormControl();

  usages: KeyValue[] = [];

  @Input()
  set cert(val: SSLCertificateEx) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      labels: Array.from(val.labels || []),
      insertDateStr: UtilService.dateFormatToLocale(new Date(val.insertDate)),



    }
    if (val.category == 'tls')
      this.usages = [{ id: 'for web', value: 'for web' },
      { id: 'for tls inspection', value: 'for tls inspection' },
      { id: 'for service', value: 'for service' }]

    this.formGroup = this.createFormGroup(this._model);
  }

  @Output()
  saveCert: EventEmitter<SSLCertificate> = new EventEmitter();
  @Output()
  deleteCert: EventEmitter<SSLCertificate> = new EventEmitter();

  @Output()
  exportCert: EventEmitter<SSLCertificate> = new EventEmitter();

  @Output()
  exportCACert: EventEmitter<SSLCertificate> = new EventEmitter();



  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: {
    name: string, publicCrt: string;
  }
    = { name: '', publicCrt: '' };

  formGroupPassword: FormGroup = this.createFormGroupPassword();



  isThemeDark = false;

  constructor(
    private route: ActivatedRoute, private clipboard: Clipboard,
    private configService: ConfigService,
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private pkiService: PKIService,
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
  downloadButtonDisabled = true;
  modelChangedPassword() {

    this.checkFormErrorPassword();
    if (this.formGroupPassword.valid)
      this.downloadButtonDisabled = false;
    else this.downloadButtonDisabled = true;


  }



  createFormGroup(cert: SSLCertificateExExtended) {
    const fmg = new FormGroup({
      name: new FormControl(cert.name, [Validators.required]),
      insertDateStr: new FormControl(cert.insertDateStr, []),
      publicCrt: new FormControl(cert.publicCrt, []),
      privateKey: new FormControl(cert.privateKey, []),


    });
    fmg.controls['insertDateStr'].disable();



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

    this.usageFormControl = new FormControl();

    const selectedUsages = this.usages.filter(x => cert.usages?.includes(x.id));
    this.usageFormControl.setValue(selectedUsages);
    this.allSub.addThis =
      this.usageFormControl.valueChanges.subscribe(x => {
        this._model.usages = (this.usageFormControl.value as any[]).map(x => x.id);
        this.modelChanged();

      })


    return fmg;
  }
  password = '';
  createFormGroupPassword() {
    const fmg = new FormGroup({
      password: new FormControl(this.password, [Validators.required]),



    });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this as any)[iterator] = x;

        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChangedPassword();
      })
    return fmg;
  }
  createFormError() {

    return { name: '', publicCrt: '' };
  }
  checkFormIsValid() {
    if (this._model.file)
      return this.formGroup.valid && this._model.file.source
    return this.formGroup.valid;
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
    if (UtilService.checkChanged(original.usages, this.cert.usages))
      this.cert.isChanged = true


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
  formErrorPassword = { password: '' };
  checkFormErrorPassword() {
    //check errors 
    this.formErrorPassword = { password: '' }

    const passwordError = this.formGroupPassword.controls.password.errors;

    if (passwordError) {
      if (passwordError['required'])
        this.formErrorPassword.password = 'PasswordRequired';
      else
        this.formErrorPassword.password = 'PasswordRequired';
    }


    (this.formGroupPassword as FormGroup).markAllAsTouched();

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
    this.saveCert.emit(this.createBaseModel());
  }

  delete() {
    this.deleteCert.emit(this.createBaseModel());
  }
  exportP12() {
    let model = this.createBaseModel();
    model.password = this.password;
    this.exportCert.emit(model);
  }
  exportPEM() {
    let model = this.createBaseModel();
    model.publicCrt = this._model.publicCrt;
    this.pkiService.exportPem(model);
    this.exportCACert.emit(model);
  }
  usageChanged() {

  }
  copyCert() {
    if (this.cert.publicCrt) {
      this.clipboard.copy(this.cert.publicCrt);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }


}
