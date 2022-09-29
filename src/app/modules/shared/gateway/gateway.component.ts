import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Gateway, Network } from '../models/network';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../services/input.service';
import { map, Observable, of, startWith } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { TranslationService } from '../services/translation.service';



export interface GatewayExtended {
  orig: Gateway;
  formGroup: FormGroup;
  formError: { name: string };
  isChanged: boolean;
  networkName: string;
}

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss']
})

export class GatewayComponent implements OnInit {
  @Input()
  gateway: Gateway =
    {
      id: '', name: '', labels: []
    };

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
  @Input() set networks(value: Network[]) {
    //empty network for reseting networkId
    this._networks = [{ id: '', name: '' } as Network].concat(value);
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

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //for testing;
    this.gateway = GatewayComponent.prepareModel(this.gateway);
  }

  ngOnInit(): void {
    this.filteredOptions = this.networkAutoCompleteFormControl.valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : value.name)),
      map(name => (name ? this._filter(name) : this.networks.slice()))
    );

  }
  networkChanged(event: any) {
    if (event?.option?.value) {
      this.gateway.networkId = event.option.value.id;
      if (this.gateway.networkId)
        this.gateway.networkName = event.option.value.name;
      else
        this.gateway.networkName = ''
      this.gatewayModelChanged(event);

    } else {
      this.gateway.networkId = '';
      this.gateway.networkName = '';
      this.gatewayModelChanged(event);
    }
  }


  static prepareModel(gate: Gateway) {
    let extended: GatewayExtended = {
      orig: JSON.parse(JSON.stringify(gate)),
      formError: this.createFormError(),
      formGroup: this.createFormGroup(gate),
      isChanged: false,
      networkName: ''

    }
    let item = {
      ...gate, ...extended
    }

    return item;
  }

  static createFormGroup(gate: Gateway) {
    return new FormGroup({
      name: new FormControl(gate.name, [Validators.required]),
      id: new FormControl(gate.id, [])

    });
  }
  static createFormError() {
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
    if (this.gateway.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this.gateway.labels = this.gateway.labels.filter(x => x != label);
    if (this.gateway.formGroup.valid)
      this.checkIfModelChanged();

  }

  gatewayModelChanged($event: any) {

    this.checkNetworkFormError();
    if (this.gateway.formGroup.valid)
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
    let error = GatewayComponent.createFormError();

    const nameError = this.gateway.formGroup.controls['name'].errors;

    if (nameError) {
      if (nameError['required'])
        error.name = 'NameRequired';
      else
        error.name = 'NameRequired';
    }



    this.gateway.formError = error;
    (this.gateway.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this.gateway.isChanged = false;
    const original = this.gateway.orig as Gateway;
    original.networkName = this.networks.find(x => x.id == original.networkId)?.name;
    Object.assign(this.gateway, original);
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


  private _filter(name: string): Network[] {
    const filterValue = name.toLowerCase();
    return this.networks.filter(option => option.id == '' || option.name.toLowerCase().includes(filterValue));

  }





}
