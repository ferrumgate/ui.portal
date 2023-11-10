import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../models/group';
import { ConfigService } from '../services/config.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { NotificationService } from '../services/notification.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { DnsRecord } from '../models/dns';
import { InputService } from '../services/input.service';



export interface DnsRecordExtended extends DnsRecord {
  orig: DnsRecord;
  isChanged: boolean;


}

@Component({
  selector: 'app-dns-record',
  templateUrl: './dns-record.component.html',
  styleUrls: ['./dns-record.component.scss']
})
export class DnsRecordComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _model: DnsRecordExtended =
    {
      id: '', fqdn: '', ip: '', labels: [], isChanged: false,
      isEnabled: true,
      orig: {
        id: '', fqdn: '', ip: '', labels: [], isEnabled: true,
      }
    };


  get dnsRecord(): DnsRecordExtended {
    return this._model;
  }

  @Input()
  set dnsRecord(val: DnsRecord) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      labels: Array.from(val.labels || []),

    }

    this.formGroup = this.createFormGroup(this._model);
  }


  @Output()
  saveDnsRecord: EventEmitter<DnsRecord> = new EventEmitter();
  @Output()
  deleteDnsRecord: EventEmitter<DnsRecord> = new EventEmitter();




  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: {
    fqdn: string,
    ip: string
  } = {
      fqdn: '', ip: '',
    }


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

    this.helpLink = this.configService.links.dnsHelp;
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
    else this.dnsRecord.isChanged = false;


  }



  createFormGroup(dnsRecord: DnsRecord) {
    const fmg = new FormGroup({
      fqdn: new FormControl(dnsRecord.fqdn, [Validators.required, InputService.domainValidator]),
      ip: new FormControl(dnsRecord.ip, [Validators.required, InputService.ipValidator]),
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
    return { fqdn: '', ip: '' };
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();


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
    this.dnsRecord.isChanged = false;
    const original = this._model.orig as DnsRecord;

    if (original.fqdn != this.dnsRecord.fqdn)
      this.dnsRecord.isChanged = true;
    if (original.ip != this.dnsRecord.ip)
      this.dnsRecord.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.dnsRecord.labels))
      this.dnsRecord.isChanged = true;

    if (original.isEnabled != this.dnsRecord.isEnabled)
      this.dnsRecord.isChanged = true;


  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();

    const fqdnError = this.formGroup.controls.fqdn.errors;

    if (fqdnError) {
      if (fqdnError['required'])
        error.fqdn = 'FqdnRequired';
      else
        error.fqdn = 'FqdnRequired';
    }

    const ipError = this.formGroup.controls.ip.errors;

    if (ipError) {
      if (ipError['required'])
        error.ip = 'IpRequired';
      else
        error.ip = 'IpRequired';
    }

    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as DnsRecord;

    this.dnsRecord = {
      ...original,
      labels: Array.from(original.labels || [])
    }

    this.checkIfModelChanged();
  }
  createBaseModel(): DnsRecord {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      fqdn: this._model.fqdn,
      ip: this._model.ip,
      isEnabled: this._model.isEnabled,
    }
  }


  saveOrUpdate() {

    this.saveDnsRecord.emit(this.createBaseModel());
  }



  delete() {
    this.deleteDnsRecord.emit(this.createBaseModel());
  }

  copyDnsRecordId() {
    if (this.dnsRecord.id) {
      this.clipboard.copy(this.dnsRecord.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }






}
