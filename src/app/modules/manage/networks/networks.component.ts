import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Gateway, Network } from '../../shared/models/network';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../shared/services/input.service';
import { NetworksRoutingModule } from './networks-routing.module';
import { NetworkComponent } from '../../shared/network/network.component';
import { GatewayComponent } from '../../shared/gateway/gateway.component';



@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss']
})
export class NetworksComponent implements OnInit {


  networks: Network[] = [];
  gateways: Gateway[] = [];
  constructor() {

  }

  ngOnInit(): void {
    let net: Network = {
      id: '312', name: 'ops', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24'
    }
    let gateways: Gateway[] = [
      { id: '123', networkId: net.id, name: 'blac', labels: ['testme'], isActive: 1 },
      { id: '1234', networkId: net.id, name: 'blac2', labels: ['testme2'], isActive: 1 },
      { id: '12345', networkId: net.id, name: 'blac3', labels: ['testme3'], isActive: 1 }
    ]



    let item = NetworkComponent.prepareModel(net);
    this.networks.push(item);
    gateways.forEach(x => {
      const extendedGateway = GatewayComponent.prepareModel(x);
      item.gatewaysCount++;
      this.gateways.push(extendedGateway);
    })

    let net2: Network = {
      id: '3123', name: 'ops2', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24'
    }
    let item2 = NetworkComponent.prepareModel(net2);
    this.networks.push(item2);

  }

  filterGateways(net: Network): any {
    if (!net.gateways)
      net.gateways = this.gateways.filter(x => x.networkId == net.id);
    return net.gateways;
  }




  clearGateway(gate: Gateway) {

  }

  saveOrUpdateGateway(gate: Gateway) {

  }

}
