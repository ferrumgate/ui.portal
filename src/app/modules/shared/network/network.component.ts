import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Network } from '../../shared/models/network';
import { InputService } from '../../shared/services/input.service';
import { SSubscription } from '../services/SSubscribtion';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';

export interface NetworkExtended extends Network {
  orig: Network;
  isChanged: boolean;
  isGatewayOpened: boolean;
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})

export class NetworkComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _network: Network = {
    id: '', name: '', gateways: [], labels: [], clientNetwork: '', serviceNetwork: '', isEnabled: true, sshHost: ''
  };
  get network() { return this._network; }

  @Input()
  set network(val: Network) {
    this._network = {
      ...val,
      orig: val,
      isChanged: false,
      isGatewayOpened: false
    }
    this._network.labels = Array.from(val.labels);
    this.formGroup = this.createFormGroup(this.network);
  };

  formError = { name: '', clientNetwork: '', serviceNetwork: '', sshHost: '' };
  formGroup = this.createFormGroup(this.network);
  @Input()
  gatewaysCount = 0;
  @Output()
  openGateways: EventEmitter<boolean> = new EventEmitter();
  @Output()
  saveNetwork: EventEmitter<Network> = new EventEmitter();
  @Output()
  deleteNetwork: EventEmitter<Network> = new EventEmitter();

  constructor(private route: ActivatedRoute, private clipboard: Clipboard,
    private configService: ConfigService,
    private translateService: TranslationService,
    private notificationService: NotificationService) {

    this.helpLink = this.configService.links.networkHelp;
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

  /*   static prepareModel(net: Network) {
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
   */
  createFormGroup(net: Network) {
    const fmg = new FormGroup({
      name: new FormControl(net.name, [Validators.required]),
      clientNetwork: new FormControl(net.clientNetwork, [Validators.required, InputService.ipCidrValidator]),
      serviceNetwork: new FormControl(net.serviceNetwork, [Validators.required, InputService.ipCidrValidator]),
      sshHost: new FormControl(net.sshHost, [Validators.required, InputService.hostValidator]),
    });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.network as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.networkModelChanged();
      })
    return fmg;
  }

  createFormError() {
    return { name: '', clientNetwork: '', serviceNetwork: '', sshHost: '' };
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
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this.network.labels = this.network.labels.filter(x => x != label);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

  networkModelChanged() {
    this.checkNetworkFormError();
    if (this.formGroup.valid)
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
    if (UtilService.checkChanged(original.labels, this.network.labels))
      this.network.isChanged = true;
    if (original.isEnabled != this.network.isEnabled)
      this.network.isChanged = true;
    if (original.sshHost != this.network.sshHost)
      this.network.isChanged = true;

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

    const clientNetworkError = this.formGroup.controls['clientNetwork'].errors;

    if (clientNetworkError) {
      if (clientNetworkError['required'])
        error.clientNetwork = 'ClientNetworkRequired';
      else
        error.clientNetwork = 'ClientNetworkInvalid';
    }

    const serviceNetworkError = this.formGroup.controls['serviceNetwork'].errors;
    if (serviceNetworkError) {
      if (serviceNetworkError['required'])
        error.serviceNetwork = 'ServiceNetworkRequired';
      else
        error.serviceNetwork = 'ServiceNetworkInvalid';
    }
    const sshHostError = this.formGroup.controls['sshHost'].errors;
    if (sshHostError) {
      if (sshHostError['required'])
        error.sshHost = 'SshHostRequired';
      else
        error.sshHost = 'SshHostInvalid';
    }
    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this.network.isChanged = false;
    const original = this.network.orig;// JSON.parse(JSON.stringify(this.network.orig));
    //Object.assign(this.network, original);
    this.network = {
      ...original
    }

    this.checkIfModelChanged();
  }

  saveOrUpdate() {
    this.saveNetwork.emit(this.network);
  }

  openGatewayClicked() {
    if (!this.gatewaysCount) return;
    this.network.isGatewayOpened = !this.network.isGatewayOpened;
    this.openGateways.emit(this.network.isGatewayOpened);
  }

  delete() {
    this.deleteNetwork.emit(this.network);
  }
  copyNetworkId() {
    if (this.network.id) {
      this.clipboard.copy(this.network.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

}
