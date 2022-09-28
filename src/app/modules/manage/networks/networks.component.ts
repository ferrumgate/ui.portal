import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Gateway, Network } from '../../shared/models/network';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../shared/services/input.service';
import { NetworksRoutingModule } from './networks-routing.module';
import { NetworkComponent } from '../../shared/network/network.component';
import { GatewayComponent } from '../../shared/gateway/gateway.component';
import { UtilService } from '../../shared/services/util.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';



@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss']
})
export class NetworksComponent implements OnInit, OnDestroy {

  gatewaysNotJoinedpanelOpenState = true;
  searchForm = new FormControl();
  messageSubscription: Subscription;
  networks: Network[] = [];
  gateways: Gateway[] = [];
  gatewaysNotJoined: Gateway[] = [];
  constructor() {

    //search input with wait
    this.messageSubscription =
      this.searchForm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(newMessage => {
        this.search(newMessage);
      });
  }

  ngOnInit(): void {



    let net: Network = {
      objId: UtilService.randomNumberString(),
      id: '312', name: 'ops', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24'
    }
    let gateways: Gateway[] = [
      { objId: UtilService.randomNumberString(), id: '123', networkId: net.id, name: 'blac', labels: ['testme'], isEnabled: 1 },
      { objId: UtilService.randomNumberString(), id: '1234', networkId: net.id, name: 'blac2', labels: ['testme2'], isEnabled: 1 },
      { objId: UtilService.randomNumberString(), id: '12345', networkId: net.id, name: 'blac3', labels: ['testme3'], isEnabled: 1 }
    ]



    let item = NetworkComponent.prepareModel(net);
    this.networks.push(item);
    gateways.forEach(x => {
      const extendedGateway = GatewayComponent.prepareModel(x);
      item.gatewaysCount++;
      extendedGateway.networkName = net.name;
      this.gateways.push(extendedGateway);
    })

    let net2: Network = {
      id: '3123', name: 'ops2', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24'
    }
    let item2 = NetworkComponent.prepareModel(net2);
    this.networks.push(item2);


    const notJoinedGateway: Gateway = {
      objId: UtilService.randomNumberString(),
      id: '1234', networkId: '',
      name: 'not joined ', labels: ['testme'], isEnabled: 1,
    };
    const notJoinedExtendedGateway = GatewayComponent.prepareModel(notJoinedGateway);
    this.gatewaysNotJoined.push(notJoinedExtendedGateway);

    const notJoinedGateway2: Gateway = {
      objId: UtilService.randomNumberString(),
      id: '12344', networkId: '',
      name: 'not joined2 ', labels: ['testme'], isEnabled: 1,
    };
    const notJoinedExtendedGateway2 = GatewayComponent.prepareModel(notJoinedGateway2);
    this.gatewaysNotJoined.push(notJoinedExtendedGateway2);



  }
  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  filterGateways(net: Network): any {
    if (!net.gateways)
      net.gateways = this.gateways.filter(x => x.networkId == net.id);
    return net.gateways;
  }



  addNewNetwork() {

    const net: Network = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', clientNetwork: '', serviceNetwork: '', labels: []
    }
    let item = NetworkComponent.prepareModel(net);
    this.networks.unshift(item);
  }

  saveNetwork($event: Network) {
    console.log(`save network ${$event}`)
  }
  deleteNetwork($event: Network) {
    console.log(`delete network ${$event}`)
    if (!$event.id) {
      const index = this.networks.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.networks.splice(index, 1);
    } else {

    }
  }
  saveGateway($event: Gateway) {
    console.log(`save gateway ${$event}`)
  }
  deleteGateway($event: Gateway) {
    console.log(`delete gateway ${$event}`)
  }


  search(data: string) {
    if (!data?.length || data?.length > 2) {
      console.log(`data is ${data}`);
    }
  }

}
