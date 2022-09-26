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
  constructor() {

  }

  ngOnInit(): void {
    let net: Network = {
      id: '312', name: 'ops', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24', gateways: [
        { id: '123', name: 'blac', labels: ['testme'], isActive: 1 },
        { id: '1234', name: 'blac2', labels: ['testme2'], isActive: 1 },
        { id: '12345', name: 'blac3', labels: ['testme3'], isActive: 1 }
      ]
    }
    let gateways = net.gateways.map(x => GatewayComponent.prepareModel(x));

    net.gateways = [];
    let item = NetworkComponent.prepareModel(net);
    item.gateways = gateways;
    this.networks.push(item);

  }




  clearGateway(gate: Gateway) {

  }

  saveOrUpdateGateway(gate: Gateway) {

  }

}
