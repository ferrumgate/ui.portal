import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

import { map, Observable, of } from 'rxjs';
import { Group } from '../models/group';
import { Network } from '../models/network';
import { Service } from '../models/service';
import { ConfigService } from '../services/config.service';
import { InputService } from '../services/input.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { ThemeSelectorComponent } from '../themeselector/themeselector.component';



export interface ServiceExtended extends Service {
  orig: Service;
  isChanged: boolean;
  networkName: string;

}

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  filteredOptions: Observable<Network[]> = of();
  _model: ServiceExtended =
    {
      id: '', name: '', labels: [], isChanged: false,
      isEnabled: true, assignedIp: '', host: '', networkId: '', networkName: '', count: 1,
      protocol: '',
      orig: {
        id: '', name: '', labels: [], isEnabled: true, assignedIp: '', host: '', networkId: '', protocol: '', count: 1
      }
    };


  get service(): ServiceExtended {
    return this._model;
  }

  @Input()
  set service(val: Service) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      labels: Array.from(val.labels || []),
      networkName: this.networks.find(x => x.id == val.networkId)?.name || ''

    }

    this.formGroup = this.createFormGroup(this._model);
  }
  _networks: Network[] = [];

  get networks(): Network[] {
    return this._networks;
  }
  @Input()
  set networks(value: Network[]) {
    //empty network for reseting networkId
    this._networks = [{ id: '', name: '' } as Network].concat(value);
    this.service.networkName = this.networks.find(x => x.id == this.service.networkId)?.name || ''
    this.prepareAutoComplete();
  }

  @Output()
  saveService: EventEmitter<Service> = new EventEmitter();
  @Output()
  deleteService: EventEmitter<Service> = new EventEmitter();



  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: {
    name: string, host: string,
    tcp: string, udp: string, network: string
  }
    = { name: '', host: '', tcp: '', udp: '', network: '' };


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

    this.helpLink = this.configService.links.serviceHelp;
  }

  ngOnInit(): void {
    this.prepareAutoComplete();
  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  prepareAutoComplete() {
    this.filteredOptions = this.filter('');
  }
  testForm = new FormControl();

  networkChanged(event: any) {

    if (event?.option?.value) {
      this.service.networkId = event.option.value.id;
      if (this.service.networkId)
        this.service.networkName = event.option.value.name;
      else
        this.service.networkName = ''
      this.formGroup.controls.networkId.setValue(this.service.networkId);
      this.formGroup.controls.networkName.setValue(this.service.networkName);
      this.modelChanged();

    } else {
      this.service.networkId = '';
      this.service.networkName = '';
      this.formGroup.controls.networkId.setValue(this.service.networkId);
      this.formGroup.controls.networkName.setValue(this.service.networkName);
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
    else this.service.isChanged = false;


  }



  createFormGroup(service: ServiceExtended) {
    const fmg = new FormGroup({
      name: new FormControl(service.name, [Validators.required]),
      tcp: new FormControl(service.tcp, []),
      udp: new FormControl(service.udp, []),
      host: new FormControl(service.host, [Validators.required, InputService.ipOrdomainValidator]),
      networkId: new FormControl(service.networkId, [Validators.required]),
      networkName: new FormControl(service.networkName, [Validators.required])

    });
    if (service.isSystem)
      fmg.disable();

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
    return { name: '', host: '', tcp: '', udp: '', network: '' };
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


  checkIfModelChanged() {
    this.service.isChanged = false;
    const original = this._model.orig as Service;

    if (original.name != this.service.name)
      this.service.isChanged = true;
    if (original.host != this.service.host)
      this.service.isChanged = true;
    if (original.tcp != this.service.tcp)
      this.service.isChanged = true;
    if (original.udp != this.service.udp)
      this.service.isChanged = true;
    if (original.networkId != this.service.networkId)
      this.service.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.service.labels))
      this.service.isChanged = true
    if (original.isEnabled != this.service.isEnabled)
      this.service.isChanged = true;

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
    const hostError = this.formGroup.controls.host.errors;

    if (hostError) {
      if (hostError['required'])
        error.host = 'HostRequired';
      else if (hostError['invalidHost'])
        error.host = "InvalidHost"
      else
        error.host = 'HostRequired';
    }

    this.formGroup.controls.tcp.setErrors(null);
    this.formGroup.controls.udp.setErrors(null);
    if (!this._model.tcp && !this._model.udp) {
      error.tcp = "RequiredTcpOrUdpPort";
      error.udp = "RequiredTcpOrUdpPort";
    } else
      if (this._model.tcp && !this._model.udp) {
        const result = InputService.portValidator(this.formGroup.controls.tcp);
        error.tcp = result ? 'InvalidPort' : '';
      } else
        if (!this._model.tcp && this._model.udp) {
          const result = InputService.portValidator(this.formGroup.controls.udp);
          error.udp = result ? 'InvalidPort' : '';
        } else {
          const result = InputService.portValidator(this.formGroup.controls.tcp);
          error.tcp = result ? 'InvalidPort' : '';
          const result2 = InputService.portValidator(this.formGroup.controls.udp);
          error.udp = result2 ? 'InvalidPort' : '';
        }
    if (error.tcp)
      this.formGroup.controls.tcp.setErrors({});
    if (error.udp)
      this.formGroup.controls.udp.setErrors({});

    const networkError = this.formGroup.controls.networkId.errors;

    if (networkError) {
      if (networkError['required'])
        error.network = 'NetworkRequired';
      else
        error.network = 'NetworkRequired';
    }



    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as Service;

    this.service = {
      ...original,
      labels: Array.from(original.labels || [])
    }

    this.checkIfModelChanged();
  }
  createBaseModel(): Service {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      name: this._model.name,
      isEnabled: this._model.isEnabled,
      assignedIp: this._model.assignedIp,
      host: this._model.host,
      networkId: this._model.networkId,
      protocol: 'raw',
      tcp: this._model.tcp,
      udp: this._model.udp,
      count: this._model.count


    }
  }


  saveOrUpdate() {

    this.saveService.emit(this.createBaseModel());
  }



  delete() {
    this.deleteService.emit(this.createBaseModel());
  }

  displayFn(net: Network | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }

  private filter(name: string) {
    const filterValue = name.toLowerCase();
    let items = this.networks;
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

  searchNetwork(ev: any) {
    if (typeof (ev) == 'string') {
      this.filteredOptions = this.filter(ev);
    }

  }








}
