import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Gateway, Network } from '../models/network';
import { SSubscription } from '../services/SSubscribtion';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { Node } from '../models/node';

export interface GatewayExtended extends Gateway {
  orig: Gateway;
  isChanged: boolean;
  networkName: string;
  nodeName: string;
}

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss']
})

export class GatewayComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _gateway: Gateway =
    {
      id: '', name: '', labels: []
    };

  get gateway() {
    return this._gateway;
  }

  @Input()
  set gateway(val: Gateway) {
    this._gateway = {
      ...val,
      isChanged: false,
      orig: val,
      networkName: this.networks.find(x => x.id == val.networkId)?.name || '',
      nodeName: this.nodes?.find(x => x.id == val.nodeId)?.name || ''

    }
    this.gateway.labels = Array.from(val.labels);
    this.formGroup = this.createFormGroup(this.gateway);
  }

  @Output()
  openGateways: EventEmitter<boolean> = new EventEmitter();
  @Output()
  saveGateway: EventEmitter<Gateway> = new EventEmitter();
  @Output()
  deleteGateway: EventEmitter<Gateway> = new EventEmitter();
  isGatewayOpened = false;

  _nodes: Node[] = [];
  _networks: Network[] = [];

  get networks(): Network[] {
    return this._networks;
  }
  formGroup: FormGroup = this.createFormGroup(this.gateway);
  formError: { name: string } = { name: '' }

  @Input()
  set networks(value: Network[]) {
    //empty network for reseting networkId
    this._networks = [{ id: '', name: '' } as Network].concat(value);
    this.gateway.networkName = this.networks.find(x => x.id == this.gateway.networkId)?.name || ''
    this.prepareAutoComplete();
  }

  @Input()
  set nodes(value: Node[]) {
    this.nodes = value;
  }

  filteredOptions: Observable<Network[]> = of();

  networkAutoCompleteFormControl = new FormControl();
  enabledFormControl = new FormControl();
  isThemeDark = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private clipboard: Clipboard,
    private notificationService: NotificationService
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //for testing;
    //this.gateway = this.prepareModel(this.gateway);
    this.helpLink = this.configService.links.gatewayHelp;
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

  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }
  networkChanged(event: any) {

    if (event?.option?.value) {
      this.gateway.networkId = event.option.value.id;
      if (this.gateway.networkId)
        this.gateway.networkName = event.option.value.name;
      else
        this.gateway.networkName = ''
      this.gatewayModelChanged();

    } else {
      this.gateway.networkId = '';
      this.gateway.networkName = '';
      this.gatewayModelChanged();
    }

  }

  /*   prepareModel(gate: Gateway) {
      let extended: GatewayExtended = {
        orig: JSON.parse(JSON.stringify(gate)),
        isChanged: false,
        networkName: '',
  
      }
  
      let item = {
        ...gate,
        ...extended,
      }
  
      return item;
    } */

  createFormGroup(gate: Gateway) {
    const fmg = new FormGroup({
      name: new FormControl(gate.name, [Validators.required]),
      id: new FormControl(gate.id, []),
      nodeName: new FormControl(gate.nodeName, []),
    });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.gateway as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.gatewayModelChanged();
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
      const isExits = this.gateway.labels.find(x => x == value);
      if (!isExits)
        this.gateway.labels.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this.gateway.labels = this.gateway.labels.filter(x => x != label);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

  gatewayModelChanged() {
    this.checkNetworkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.gateway.isChanged = false;

  }
  checkIfModelChanged() {
    this.gateway.isChanged = false;
    const original = this.gateway.orig as Gateway;

    if (original.name != this.gateway.name)
      this.gateway.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.gateway.labels))
      this.gateway.isChanged = true;
    if (original.isEnabled != this.gateway.isEnabled)
      this.gateway.isChanged = true;
    if (original.networkId != this.gateway.networkId)
      this.gateway.isChanged = true;

  }

  checkNetworkFormError() {
    //check errors 
    let error = this.createFormError();

    const nameError = this.formGroup.controls['name'].errors;

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
    this.gateway.isChanged = false;
    const original = this.gateway.orig as Gateway;
    //original.networkName = this.networks.find(x => x.id == original.networkId)?.name || '';
    //Object.assign(this.gateway, original);
    this.gateway = {
      ...original
    }

    this.gateway.networkName = this.networks.find(x => x.id == original.networkId)?.name || '';
    this.checkIfModelChanged();
  }

  saveOrUpdate() {

    this.saveGateway.emit(this.gateway);
  }

  openGatewayClicked() {
    this.isGatewayOpened = !this.isGatewayOpened;
    this.openGateways.emit(this.isGatewayOpened);
  }

  delete() {
    this.deleteGateway.emit(this.gateway);
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
  displayFn(net: Network | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }

  searchNetwork(ev: any) {
    if (typeof (ev) == 'string') {
      this.filteredOptions = this.filter(ev);
    }

  }
  copyGatewayId() {
    if (this.gateway.id) {
      this.clipboard.copy(this.gateway.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

}
