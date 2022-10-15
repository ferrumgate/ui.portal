import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { A, COMMA, ENTER } from '@angular/cdk/keycodes';
import { Gateway, Network } from '../models/network';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../services/input.service';
import { map, Observable, of, startWith, takeWhile } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { TranslationService } from '../services/translation.service';
import { SSubscription } from '../services/SSubscribtion';




export interface GatewayExtended extends Gateway {
  orig: Gateway;
  isChanged: boolean;
  networkName: string;
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
      networkName: this.networks.find(x => x.id == val.networkId)?.name || ''

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

  filteredOptions: Observable<Network[]> = of();

  networkAutoCompleteFormControl = new FormControl();
  enabledFormControl = new FormControl();
  isThemeDark = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
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
    this.filteredOptions = of(this.networks).pipe(

      map(data => {

        data.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        })
        return data;
      })
    )
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
      id: new FormControl(gate.id, [])

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
    original.labels.forEach(x => {
      if (!this.gateway.labels.find(y => y == x))
        this.gateway.isChanged = true;

    })
    this.gateway.labels.forEach(x => {
      if (!original.labels.find(y => y == x))
        this.gateway.isChanged = true;
    })
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


  private filter(name: string): Network[] {
    const filterValue = name.toLowerCase();
    const filteredItems = this.networks.filter(option => option.id == '' || option.name.toLowerCase().includes(filterValue));
    return filteredItems;

  }
  displayFn(net: Network | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }





}
