import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Gateway, Network } from '../models/network';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../services/input.service';



export interface GatewayExtended {
  orig: Gateway;
  formGroup: FormGroup;
  formError: { name: string };
  isChanged: boolean;
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
  isGatewayOpened = false;
  constructor() { }

  ngOnInit(): void {
  }


  static prepareModel(gate: Gateway) {
    let extended: GatewayExtended = {
      orig: JSON.parse(JSON.stringify(gate)),
      formError: this.createFormError(),
      formGroup: this.createFormGroup(gate),
      isChanged: false

    }
    let item = {
      ...gate, ...extended
    }
    return item;
  }

  static createFormGroup(gate: Gateway) {
    return new FormGroup({
      name: new FormControl(gate.name, [Validators.required]),

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
    const original = this.gateway.orig as Network;
    if (original.clientNetwork != this.gateway.clientNetwork)
      this.gateway.isChanged = true;
    if (original.serviceNetwork != this.gateway.serviceNetwork)
      this.gateway.isChanged = true;
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
    const original = this.gateway.orig;
    Object.assign(this.gateway, original);
    this.checkIfModelChanged();
  }

  saveOrUpdate() {

  }

  openGatewayClicked() {
    this.isGatewayOpened = !this.isGatewayOpened;
    this.openGateways.emit(this.isGatewayOpened);
  }



}
