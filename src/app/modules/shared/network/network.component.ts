import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Gateway, Network } from '../../shared/models/network';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../shared/services/input.service';



export interface NetworkExtended {
  orig: Network;
  formGroup: FormGroup;
  formError: { name: string, clientNetwork: string, serviceNetwork: string };
  isChanged: boolean;
  isGatewayOpened: boolean;
  gatewaysCount: number;

}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})

export class NetworkComponent implements OnInit {
  @Input()
  network: Network =
    {
      id: '', name: '', gateways: [], labels: [], clientNetwork: '', serviceNetwork: ''
    };

  @Output()
  openGateways: EventEmitter<boolean> = new EventEmitter();
  @Output()
  saveNetwork: EventEmitter<Network> = new EventEmitter();
  isGatewayOpened = false;
  constructor() { }

  ngOnInit(): void {
  }


  static prepareModel(net: Network) {
    let extended: NetworkExtended = {
      gatewaysCount: 0,
      orig: JSON.parse(JSON.stringify(net)),
      formError: this.createFormError(),
      formGroup: this.createFormGroup(net),
      isChanged: false,
      isGatewayOpened: false

    }
    let item = {
      ...net, ...extended
    }
    return item;
  }

  static createFormGroup(net: Network) {
    return new FormGroup({
      name: new FormControl(net.name, [Validators.required]),
      clientNetwork: new FormControl(net.clientNetwork, [Validators.required, InputService.ipCidrValidator]),
      serviceNetwork: new FormControl(net.serviceNetwork, [Validators.required, InputService.ipCidrValidator]),
    });
  }
  static createFormError() {
    return { name: '', clientNetwork: '', serviceNetwork: '' };
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this.network.labels.find(x => x == value);
      if (!isExits)
        this.network.labels.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    if (this.network.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this.network.labels = this.network.labels.filter(x => x != label);
    if (this.network.formGroup.valid)
      this.checkIfModelChanged();

  }

  networkModelChanged($event: any) {
    this.checkNetworkFormError();
    if (this.network.formGroup.valid)
      this.checkIfModelChanged();
    else this.network.isChanged = false;

  }
  checkIfModelChanged() {
    this.network.isChanged = false;
    const original = this.network.orig as Network;
    if (original.clientNetwork != this.network.clientNetwork)
      this.network.isChanged = true;
    if (original.serviceNetwork != this.network.serviceNetwork)
      this.network.isChanged = true;
    if (original.name != this.network.name)
      this.network.isChanged = true;
    original.labels.forEach(x => {
      if (!this.network.labels.find(y => y == x))
        this.network.isChanged = true;

    })
    this.network.labels.forEach(x => {
      if (!original.labels.find(y => y == x))
        this.network.isChanged = true;
    })

  }

  checkNetworkFormError() {
    //check errors 
    let error = NetworkComponent.createFormError();

    const nameError = this.network.formGroup.controls['name'].errors;

    if (nameError) {
      if (nameError['required'])
        error.name = 'NameRequired';
      else
        error.name = 'NameRequired';
    }


    const clientNetworkError = this.network.formGroup.controls['clientNetwork'].errors;

    if (clientNetworkError) {
      if (clientNetworkError['required'])
        error.clientNetwork = 'ClientNetworkRequired';
      else
        error.clientNetwork = 'ClientNetworkInvalid';
    }

    const serviceNetworkError = this.network.formGroup.controls['serviceNetwork'].errors;
    if (serviceNetworkError) {
      if (serviceNetworkError['required'])
        error.serviceNetwork = 'ServiceNetworkRequired';
      else
        error.serviceNetwork = 'ServiceNetworkInvalid';
    }
    this.network.formError = error;
    (this.network.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this.network.isChanged = false;
    const original = JSON.parse(JSON.stringify(this.network.orig));
    Object.assign(this.network, original);
    this.checkIfModelChanged();
  }

  saveOrUpdate() {

  }

  openGatewayClicked() {
    this.network.isGatewayOpened = !this.network.isGatewayOpened;
    this.openGateways.emit(this.network.isGatewayOpened);
  }



}
