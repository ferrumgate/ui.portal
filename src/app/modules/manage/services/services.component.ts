import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from 'src/app/modules/shared/models/group';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { TranslationService } from '../../shared/services/translation.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmService } from '../../shared/services/confirm.service';
import { debounceTime, of, distinctUntilChanged, map, switchMap, takeWhile } from 'rxjs';
import { UtilService } from '../../shared/services/util.service';
import { Service } from '../../shared/models/service';
import { Network } from '../../shared/models/network';
import { NetworkService } from '../../shared/services/network.service';
import { ServiceService } from '../../shared/services/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();
  networkFormControl = new FormControl();

  services: Service[] = [];
  networks: Network[] = [];
  isThemeDark = false;
  searchKey = '';
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private networkService: NetworkService,
    private serviceService: ServiceService
  ) {

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';
    //search input with wait
    this.allSubs.addThis =
      this.searchForm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe(newMessage => {
        this.searchKey = newMessage;
        this.search();
      })



  }
  ngOnInit(): void {
    //test data
    /* let network: Network = {
      id: 'testNetworkId', name: 'testnet'
    } as Network;
    this.networks.push(network);
    let service: Service = {
      id: 's1',
      name: 'service1', labels: ['test1'], host: '10.0.0.1',
      isEnabled: true, networkId: 'testNetworkId',
      protocol: 'raw', tcp: 80, udp: 80,
      assignedIp: '192.168.1.1'
    }
    this.services.push(service); */
    this.getAllData().subscribe();
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }


  getAllData() {
    return this.networkService.get2().pipe(
      map(y => {
        this.networks = y.items as any;
      }),
      switchMap(y => this.serviceService.get2()),
      map(z => {
        this.services = z.items.map(x => {
          x.objId = UtilService.randomNumberString();
          return x;
        })
      })
    )

  }


  search() {
    let search = this.searchKey.length > 1 ? this.searchKey : '';
    let networkIds: string[] = Array.isArray(this.networkFormControl.value) ? this.networkFormControl.value.map((x: any) => x.id) : [];

    of(this.networks).pipe(
      switchMap((x) => {//get groups only once
        if (!x.length)
          return this.networkService.get2().pipe(map(x => x.items));
        return of(x);
      }),
      map(x => this.networks = x),
      switchMap(y => this.serviceService.get2(search, [], networkIds)),
      map(z => {
        this.services = z.items.map(x => {
          x.objId = UtilService.randomNumberString();
          return x;
        })
      })
    ).subscribe();
  }
  addNewService() {
    const service: Service = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', labels: [], isEnabled: true,
      host: '', assignedIp: '', networkId: '', protocol: 'raw'
    }
    this.services.unshift(service);
  }
  saveService($event: Service) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.serviceService.saveOrupdate($event)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.services.findIndex(x => x.objId == $event.objId);
      const oldObj = this.services[index];
      this.services[index] = {
        ...item,
        objId: oldObj.objId
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }
  deleteService($event: Service) {
    if (!$event.id) {//service we created temporarily
      const index = this.services.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.services.splice(index, 1);

    } else {
      //real group execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.serviceService.delete($event)
        ),
      ).subscribe((x) => {
        //delete from group list
        const index = this.services.findIndex(x => x.objId == $event.objId);
        this.services.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }



}
