import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeWhile } from 'rxjs';
import { Gateway, Network } from '../../shared/models/network';
import { SSubscription } from '../../shared/services/SSubscribtion';
import { ConfigService } from '../../shared/services/config.service';
import { ConfirmService } from '../../shared/services/confirm.service';
import { GatewayService } from '../../shared/services/gateway.service';
import { NetworkService } from '../../shared/services/network.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslationService } from '../../shared/services/translation.service';
import { UtilService } from '../../shared/services/util.service';
import { NodeService } from '../../shared/services/node.service';
import { Node } from '../../shared/models/node';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss']
})
export class NetworksComponent implements OnInit, OnDestroy {

  gatewaysNotJoinedpanelOpenState = true;
  searchForm = new FormControl();
  allSubs: SSubscription = new SSubscription();
  nodes: Node[] = [];
  networks: Network[] = [];
  gateways: Gateway[] = [];
  gatewaysNotJoined: Gateway[] = [];
  isThemeDark = false;
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private gatewayService: GatewayService,
    private networkService: NetworkService,
    private nodeService: NodeService,
    private confirmService: ConfirmService,
    private configService: ConfigService
  ) {
    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //search input with wait
    this.allSubs.addThis =
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
      { objId: UtilService.randomNumberString(), id: '123', networkId: net.id, name: 'blac', labels: ['testme'], isEnabled: true },
      { objId: UtilService.randomNumberString(), id: '1234', networkId: net.id, name: 'blac2', labels: ['testme2'], isEnabled: true },
      { objId: UtilService.randomNumberString(), id: '12345', networkId: net.id, name: 'blac3', labels: ['testme3'], isEnabled: true }
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
      name: 'not joined ', labels: ['testme'], isEnabled: true,
    };
    const notJoinedExtendedGateway = GatewayComponent.prepareModel(notJoinedGateway);
    this.gatewaysNotJoined.push(notJoinedExtendedGateway);

    const notJoinedGateway2: Gateway = {
      objId: UtilService.randomNumberString(),
      id: '12344', networkId: '',
      name: 'not joined2 ', labels: ['testme'], isEnabled: true,
    };
    const notJoinedExtendedGateway2 = GatewayComponent.prepareModel(notJoinedGateway2);
    this.gatewaysNotJoined.push(notJoinedExtendedGateway2); */

    this.getAllData().subscribe();

  }
  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }

  prepareGateway(gateway: Gateway) {
    //const model = GatewayComponent.prepareModel(gateway);
    gateway.objId = UtilService.randomNumberString();
    return gateway;
  }
  prepareNetwork(network: Network) {

    network.objId = UtilService.randomNumberString();
    network.gatewaysCount = 0;
    return network
  }
  prepareNetworks() {
    this.networks.forEach(a => {
      a.gatewaysCount = this.gateways.filter(x => x.networkId == a.id).length;
      if (!a.gatewaysCount)
        a.isGatewayOpened = false;//close if zero gateway
      this.gateways.filter(z => z.networkId == a.id).forEach(b => b.networkName = a.name);

    })

  }
  prepareNotJoinedGateways() {

    this.gatewaysNotJoined = this.gateways.filter(x => !x.networkId);
    return this.gatewaysNotJoined;
  }

  getAllData() {
    return this.nodeService.get2().pipe(
      map(z => this.nodes = z.items),
      switchMap(y => this.networkService.get2()),
      map(y => {
        this.networks = y.items.map(x => {
          return this.prepareNetwork(x);
        });
      }),
      switchMap(y => this.nodeService.get2()),
      map(z => this.nodes = z.items),
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

  filterGateways(net: Network): any {

    //if (!net.gateways || force)
    return this.gateways.filter(x => x.networkId == net.id);
    //return net.gateways;
  }

  addNewNetwork() {

    const net: Network = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', clientNetwork: '', serviceNetwork: '', labels: [], isEnabled: true
    }
    let item = this.prepareNetwork(net);
    this.networks.unshift(item);
  }

  saveNetwork($event: Network) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.networkService.saveOrupdate($event)),
    ).subscribe((item) => {

      //find saved item and replace it
      const index = this.networks.findIndex(x => x.objId == $event.objId)
      const current = this.networks[index];
      this.networks[index] = {
        ...item

      }

      this.prepareNetwork(this.networks[index]);
      this.prepareNotJoinedGateways();
      this.prepareNetworks();
      this.networks[index].isGatewayOpened = current.isGatewayOpened;
      if (this.gatewaysNotJoined.length)
        this.gatewaysNotJoined[0].name = new Date().toISOString();
      this.networks = [].concat(this.networks as any);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

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
        this.networks = [].concat(this.networks as any);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }
  saveGateway($event: Gateway) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.gatewayService.saveOrupdate($event)),
    ).subscribe(y => {

      const index = this.gateways.findIndex(x => x.objId == $event.objId);
      this.gateways[index] = {
        ...y
      }
      this.prepareGateway(this.gateways[index]);
      this.prepareNotJoinedGateways();
      this.prepareNetworks();
      this.gateways = [].concat(this.gateways as any);
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
        this.gateways = [].concat(this.gateways as any);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
  }

}
