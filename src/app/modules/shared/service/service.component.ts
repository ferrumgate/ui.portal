import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

import { map, Observable, of } from 'rxjs';
import { Group } from '../models/group';
import { Network } from '../models/network';
import { Service, ServiceAlias, ServiceHost, ServicePort } from '../models/service';
import { ConfigService } from '../services/config.service';
import { InputService } from '../services/input.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { ThemeSelectorComponent } from '../themeselector/themeselector.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '../services/notification.service';
import * as diff from 'deep-object-diff';


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
      isEnabled: true, assignedIp: '', networkId: '', networkName: '', count: 1,
      protocol: '',
      hosts: [], ports: [], aliases: [],
      orig: {
        id: '', name: '', labels: [], isEnabled: true, assignedIp: '', networkId: '', protocol: '', count: 1,
        aliases: [],
        hosts: [], ports: []
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
      networkName: this.networks.find(x => x.id == val.networkId)?.name || '',
      ports: this.clonePorts(val.ports),
      hosts: this.cloneHosts(val.hosts),
      aliases: this.cloneAliases(val.aliases || [])
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
    name: string, hosts: string[],
    ports: string[],
    aliases: string[], network: string, portNeeds: string
  }
    = { name: '', hosts: [], ports: [], aliases: [], network: '', portNeeds: '' };


  isThemeDark = false;
  constructor(
    private route: ActivatedRoute, private clipboard: Clipboard,
    private configService: ConfigService,
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private fb: FormBuilder
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

  bindFormGroup(fmg: FormGroup, target: any) {
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          target[iterator] = x;

        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
  }

  createFormGroup(service: ServiceExtended) {
    const fmg = new FormGroup({
      name: new FormControl(service.name, [Validators.required, InputService.hostValidator]),
      protocol: new FormControl(service.protocol, [Validators.required]),
      /*  tcp: new FormControl(service.tcp, []),
       udp: new FormControl(service.udp, []),
       host: new FormControl(service.host, [Validators.required, InputService.ipOrdomainValidator]), */
      networkId: new FormControl(service.networkId, [Validators.required]),
      networkName: new FormControl(service.networkName, [Validators.required]),
      assignedIp: new FormControl(service.assignedIp, []),
      ports: new FormArray([]),
      hosts: new FormArray([]),
      aliases: new FormArray([]),
      portNeeds: new FormControl(service.portNeeds, [])

    });
    fmg.controls['protocol'].disable();
    fmg.controls['assignedIp'].disable();
    if (service.isSystem) {

      fmg.controls['networkId'].disable();
      fmg.controls['networkName'].disable();
      fmg.controls['name'].disable();
    }
    for (const port of service.ports) {
      (fmg.controls['ports'] as FormArray).push(new FormGroup({
        port: new FormControl(port.port, [Validators.required, Validators.min(1)])
      }))
    }
    for (const host of service.hosts) {
      (fmg.controls['hosts'] as FormArray).push(new FormGroup({
        host: new FormControl(host.host, [Validators.required, InputService.ipOrdomainValidator])
      }))
    }

    for (const host of service.aliases || []) {
      (fmg.controls['aliases'] as FormArray).push(new FormGroup({
        host: new FormControl(host.host, [Validators.required, InputService.domainValidator])
      }))
    }

    //if (service.isSystem)
    //  fmg.disable();

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {
      if (iterator == 'ports') {
        const fmarray = fmg.controls['ports'] as FormArray;
        for (let i = 0; i < fmarray.controls.length; ++i) {
          const grp = fmarray.controls[i] as FormGroup;
          this.bindFormGroup(grp, this._model.ports[i]);

        }


      } else
        if (iterator == 'hosts') {
          const fmarray = fmg.controls['hosts'] as FormArray;
          for (let i = 0; i < fmarray.controls.length; ++i) {
            const grp = fmarray.controls[i] as FormGroup;
            this.bindFormGroup(grp, this._model.hosts[i]);
          }

        } else
          if (iterator == 'aliases') {
            const fmarray = fmg.controls['aliases'] as FormArray;
            if (!this._model.aliases)
              this._model.aliases = [];
            for (let i = 0; i < fmarray.controls.length; ++i) {
              const grp = fmarray.controls[i] as FormGroup;
              this.bindFormGroup(grp, this._model.aliases[i]);
            }

          } else {
            const fm = fmg.controls[iterator] as FormControl;
            this.allSub.addThis =
              fm.valueChanges.subscribe(x => {
                if (iterator == 'name')
                  (this._model as any)[iterator] = x.toLowerCase();
                else
                  (this._model as any)[iterator] = x;



              })
          }
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe((x) => {
        this.modelChanged();
      })
    return fmg;
  }
  createFormError() {
    return {
      name: '', hosts: this.service.hosts.map(x => ''),
      ports: this.service.ports.map(x => ''),
      aliases: this.service.aliases?.map(x => '') || [],
      network: '', portNeeds: ''
    };
  }
  getHostsFormGroup(index: number) {
    return (this.formGroup.controls['hosts'] as FormArray).controls[index] as FormGroup
  }

  getPortsFormGroup(index: number) {
    return (this.formGroup.controls['ports'] as FormArray).controls[index] as FormGroup
  }

  getAliasesFormGroup(index: number) {
    return (this.formGroup.controls['aliases'] as FormArray).controls[index] as FormGroup
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

  isChanged(a: any, b: any) {
    const diffFields2 = diff.diff(a || [], b || []);
    if (a == undefined && b == undefined) return false;
    if (a == undefined && b && Array.isArray(b) && !b.length) return false;
    if (a == undefined && b && Array.isArray(b) && b.length) return true;
    if (b == undefined && a && Array.isArray(a) && !a.length) return false;
    if (b == undefined && a && Array.isArray(a) && a.length) return true;

    if (Array.isArray(a) && Array.isArray(b) && a.length != b.length) return true;

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
    this.service.isChanged = false;
    const original = this._model.orig as Service;

    if (original.name != this.service.name)
      this.service.isChanged = true;

    if (original.networkId != this.service.networkId)
      this.service.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.service.labels))
      this.service.isChanged = true
    if (original.isEnabled != this.service.isEnabled)
      this.service.isChanged = true;

    if (this.isChanged(original.hosts, this.service.hosts))
      this.service.isChanged = true;
    if (this.isChanged(original.ports, this.service.ports))
      this.service.isChanged = true;
    if (this.isChanged(original.aliases, this.service.aliases))
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
        if (nameError['invalidHost'])
          error.name = 'InvalidHostname';
        else
          error.name = 'NameRequired';
    }

    for (let i = 0; i < (this.formGroup.controls['hosts'] as FormArray).controls.length; ++i) {
      const fmg = (this.formGroup.controls['hosts'] as FormArray).controls[i] as FormGroup;
      const hostError = fmg.controls.host.errors;
      if (hostError) {
        if (hostError['required'])
          error.hosts[i] = 'HostRequired';
        else
          if (hostError['invalidHost'])
            error.hosts[i] = 'InvalidHost';
          else
            error.hosts[i] = 'HostRequired';
      }
    }

    for (let i = 0; i < (this.formGroup.controls['aliases'] as FormArray).controls.length; ++i) {
      const fmg = (this.formGroup.controls['aliases'] as FormArray).controls[i] as FormGroup;
      const hostError = fmg.controls.host.errors;
      if (hostError) {
        if (hostError['required'])
          error.aliases[i] = 'HostRequired';
        else
          if (hostError['invalidHost'])
            error.aliases[i] = 'InvalidHost';
          else
            error.aliases[i] = 'HostRequired';
      }
    }


    for (let i = 0; i < (this.formGroup.controls['ports'] as FormArray).controls.length; ++i) {
      const fmg = (this.formGroup.controls['ports'] as FormArray).controls[i] as FormGroup;
      const portError = fmg.controls.port.errors;
      if (portError && Object.keys(portError).length) {
        if (portError['required'])
          error.ports[i] = 'InvalidPort';
        else
          error.ports[i] = 'InvalidPort';
      } else
        if (!this.service.ports[i].isTcp && !this.service.ports[i].isUdp) {
          error.ports[i] = 'RequiredTcpOrUdpPort';
          fmg.controls['port'].setErrors({});
          fmg.markAllAsTouched();
        } else {
          fmg.controls['port'].setErrors(null);
          fmg.markAllAsTouched();
        }
    }





    const networkError = this.formGroup.controls.networkId.errors;

    if (networkError) {
      if (networkError['required'])
        error.network = 'NetworkRequired';
      else
        error.network = 'NetworkRequired';
    }



    this.formError = error;

    if (!this.service.ports.length || !this.service.hosts.length) {
      this.formGroup.controls['portNeeds'].setErrors({});
      error.portNeeds = 'EnterAtLeastOnePort';
    }
    else {
      this.formGroup.controls['portNeeds'].setErrors(null);
    }
    this.formGroup.markAllAsTouched();


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
  clonePorts(ports: ServicePort[]): ServicePort[] {
    return ports.map(x => {

      const a: ServicePort = {
        port: x.port, isTcp: x.isTcp, isUdp: x.isUdp, protocol: x.protocol
      }
      if (a.protocol == undefined)
        delete a.protocol;
      return a;
    })
  }
  cloneHosts(hosts: ServiceHost[]): ServiceHost[] {
    return hosts.map(x => {
      const b: ServiceHost =
      {
        host: x.host
      }
      return b;
    })
  }
  cloneAliases(hosts: ServiceAlias[]): ServiceAlias[] {
    return hosts.map(x => {
      const b: ServiceAlias =
      {
        host: x.host
      }
      return b;
    })
  }

  createBaseModel(): Service {
    return {
      id: this._model.id,
      objId: this._model.objId,
      labels: Array.from(this._model.labels || []),
      name: this._model.name,
      isEnabled: this._model.isEnabled,
      assignedIp: this._model.assignedIp,
      hosts: this.cloneHosts(this._model.hosts),
      ports: this.clonePorts(this._model.ports),
      networkId: this._model.networkId,
      protocol: this._model.protocol,
      count: this._model.count,
      aliases: this.cloneAliases(this._model.aliases || [])

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

  copyServiceId() {
    if (this.service.id) {
      this.clipboard.copy(this.service.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

  removePort(val: ServicePort) {
    let index = this.service.ports.findIndex(x => x == val)
    if (index > -1) {
      this.service.ports.splice(index, 1);
      (this.formGroup.controls['ports'] as FormArray).removeAt(index);
    }

    this.modelChanged();
  }
  addNewPort() {
    const data = { port: 80, isTcp: true, isUdp: true };
    this.service.ports.push(data);
    const fmg = new FormGroup({
      port: new FormControl(data.port, [Validators.required, Validators.min(1)])
    });
    (this.formGroup.controls['ports'] as FormArray).push(fmg);
    this.bindFormGroup(fmg, data);

    this.modelChanged();
  }

  removeHost(val: ServiceHost) {
    let index = this.service.hosts.findIndex(x => x == val)
    if (index > -1) {
      this.service.hosts.splice(index, 1);
      (this.formGroup.controls['hosts'] as FormArray).removeAt(index);
    }
    this.modelChanged();
  }
  addNewHost() {
    const data = { host: '' };
    this.service.hosts.push(data);
    const fmg = new FormGroup({
      host: new FormControl(data.host, [Validators.required, InputService.ipOrdomainValidator])
    });
    (this.formGroup.controls['hosts'] as FormArray).push(fmg);
    this.bindFormGroup(fmg, data);
    this.modelChanged();
  }


  removeAlias(val: ServiceAlias) {
    if (!this.service.aliases)
      this.service.aliases = [];
    let index = this.service.aliases.findIndex(x => x == val)
    if (index > -1) {
      this.service.aliases.splice(index, 1);
      (this.formGroup.controls['aliases'] as FormArray).removeAt(index);
    }

    this.modelChanged();
  }
  addNewAlias() {
    if (!this.service.aliases)
      this.service.aliases = [];
    const data = { host: '' };
    this.service.aliases.push(data);
    const fmg = new FormGroup({
      host: new FormControl(data.host, [Validators.required, InputService.domainValidator])
    });
    (this.formGroup.controls['aliases'] as FormArray).push(fmg);
    this.bindFormGroup(fmg, data);

    this.modelChanged();
  }







}
