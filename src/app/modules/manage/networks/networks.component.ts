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
import { concat, concatMap, debounceTime, distinctUntilChanged, filter, map, merge, mergeMap, of, startWith, Subscription, switchMap, takeWhile } from 'rxjs';
import { TranslationService } from '../../shared/services/translation.service';
import { NotificationService } from '../../shared/services/notification.service';
import { GatewayService } from '../../shared/services/gateway.service';
import { NetworkService } from '../../shared/services/network.service';
import { ConfirmService } from '../../shared/services/confirm.service';
import { ThemeSelectorComponent } from '../../shared/themeselector/themeselector.component';



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
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private gatewayService: GatewayService,
    private networkService: NetworkService,
    private confirmService: ConfirmService

  ) {

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

    // test data
    /* let net: Network = {
      objId: UtilService.randomNumberString(),
      id: '312', name: 'ops3', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

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
    this.gatewaysNotJoined.push(notJoinedExtendedGateway2); */



    this.getAllData().subscribe();

  }
  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  prepareGateway(gateway: Gateway) {
    const model = GatewayComponent.prepareModel(gateway);
    model.objId = UtilService.randomNumberString();
    return model;
  }
  prepareNetwork(network: Network) {
    const model = NetworkComponent.prepareModel(network);
    model.objId = UtilService.randomNumberString();
    model.gatewaysCount = 0;
    return model
  }
  prepareNetworks() {
    this.networks.forEach(a => {
      a.gatewaysCount = this.gateways.filter(x => x.networkId == a.id).length;
      a.isGatewayOpened = a.isGatewayOpened & a.gatewaysCount;//close if zero gateway
      this.gateways.filter(z => z.networkId == a.id).forEach(b => b.networkName = a.name);

    })
  }
  prepareNotJoinedGateways() {
    this.gatewaysNotJoined = this.gateways.filter(x => !x.networkId);
  }


  getAllData() {
    return this.networkService.get2().pipe(
      map(y => {
        this.networks = y.items.map(x => {
          return this.prepareNetwork(x);
        });
      }),
      switchMap(y => this.gatewayService.get2()),
      map(z => {
        this.gateways = z.items.map(x => {
          return this.prepareGateway(x);
        });
        this.prepareNotJoinedGateways();
        this.prepareNetworks();
      })
    )

  }

  search(data: string) {
    if (!data?.length || data?.length > 2) {
      if (data == '')
        this.getAllData().subscribe();
      else {
        this.networkService.get2(data).pipe(
          map(y => {
            this.networks = y.items.map(x => {
              return this.prepareNetwork(x);
            });
            return y;
          }),
          switchMap(y => {
            return this.gatewayService.get2();
          }),
          map(z => {
            this.gateways = z.items.filter(x => this.networks.find(ab => ab.id == x.networkId)).map(x => {
              return this.prepareGateway(x);
            });
            this.prepareNotJoinedGateways();
            this.prepareNetworks();
          })
        ).subscribe();
      }

    }
  }

  filterGateways(net: Network, force = false): any {
    if (!net.gateways || force)
      net.gateways = this.gateways.filter(x => x.networkId == net.id);
    return net.gateways;
  }


  addNewNetwork() {

    const net: Network = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', clientNetwork: '', serviceNetwork: '', labels: []
    }
    let item = this.prepareNetwork(net);
    this.networks.unshift(item);
  }

  saveNetwork($event: Network) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.networkService.saveOrupdate($event)),
    ).subscribe((item) => {
      //if saved, a new id comes, set it back
      if (item.id != $event.id) {
        $event.id = item.id;
      }
      $event.orig = item;
      $event.isChanged = false;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    });
  }
  deleteNetwork($event: Network) {

    if (!$event.id) {//network we created temporarily
      const index = this.networks.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.networks.splice(index, 1);

    } else {
      //real network execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.networkService.delete($event)
        ),
      ).subscribe(() => {
        //delete from network list
        const index = this.networks.findIndex(x => x.objId == $event.objId);
        this.networks.splice(index, 1);
        //delete from gateway list
        this.gateways.
          filter(y => y.networkId == $event.id)
          .forEach(y => {
            y.networkName = '';
            y.networkId = ''
          });
        this.prepareNotJoinedGateways();
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }
  saveGateway($event: Gateway) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.gatewayService.saveOrupdate($event)),
    ).subscribe(y => {

      //original list
      const networkId = ($event.orig as Gateway).networkId;
      const net = this.networks.find(x => x.id == networkId);
      if (net) this.filterGateways(net, true);
      //new network
      const networkId2 = ($event.networkId);
      const net2 = this.networks.find(x => x.id == networkId2);
      if (net2) this.filterGateways(net2, true);
      $event.orig = y;
      $event.isChanged = false;

      this.prepareNotJoinedGateways();
      this.prepareNetworks();
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    })
  }
  deleteGateway($event: Gateway) {
    this.confirmService.showDelete()
      .pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.gatewayService.delete($event)
        )

      ).subscribe(y => {
        const index = this.gateways.findIndex(a => a.id == $event.id);
        this.gateways.splice(index, 1);
        this.prepareNotJoinedGateways();
        this.prepareNetworks();
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
  }




}
