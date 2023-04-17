import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfigService } from '../../../../../app/modules/shared/services/config.service';
import { SSubscription } from '../../../../../app/modules/shared/services/SSubscribtion';


import { TranslationService } from '../../../shared/services/translation.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { debounceTime, of, distinctUntilChanged, map, switchMap, takeWhile, catchError, throwError } from 'rxjs';
import { Service } from '../../../../../app/modules/shared/models/service';
import { Network } from '../../../../../app/modules/shared/models/network';
import { AuthorizationPolicy, AuthorizationRule } from '../../../../../app/modules/shared/models/authzPolicy';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { Group } from 'src/app/modules/shared/models/group';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NetworkService } from 'src/app/modules/shared/services/network.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { ServiceService } from 'src/app/modules/shared/services/service.service';
import { PolicyAuthzService } from 'src/app/modules/shared/services/policyAuthz.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { fadeInItems } from '@angular/material/menu';


interface Policy { network: Network, rules: AuthorizationRule[], isExpanded: boolean }




@Component({
  selector: 'app-policy-authz',
  templateUrl: './policy-authz.component.html',
  styleUrls: ['./policy-authz.component.scss']
})
export class PolicyAuthzComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();
  networkFormControl = new FormControl();
  services: Service[] = [];
  networks: Network[] = [];
  users: User2[] = [];
  groups: Group[] = [];
  performance: {
    users: Map<string, User2>,
    groups: Map<string, Group>,
    networks: Map<string, Network>
    services: Map<string, Service>
  } = {} as any;

  policies: Policy[] = [{
    network: { id: '' } as any, rules: [], isExpanded: false
  }]
  policyAuthz: AuthorizationPolicy = { rules: [] } as any;
  helpLink = '';
  isThemeDark = false;
  searchKey = '';
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private networkService: NetworkService,
    private userService: UserService,
    private groupService: GroupService,
    private serviceService: ServiceService,
    private policyAuthzService: PolicyAuthzService

  ) {

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';
    this.helpLink = this.configService.links.policyAuthzHelp;
    //search input with wait
    this.allSubs.addThis =
      this.searchForm.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe(newMessage => {
        this.searchKey = newMessage;
        this.search();
      })



  }
  ngOnInit(): void {
    //test data

    /*  this.groups.push({ id: 'group1', name: 'North1', isEnabled: true, labels: [] })
     this.groups.push({ id: 'group2', name: 'North2', isEnabled: true, labels: [] })
     this.groups.push({ id: 'group3', name: 'North3', isEnabled: true, labels: [] })
 
     const user1: User2 = {
       username: 'hamza@ferrumgate.com',
       id: 'someid',
       name: 'hamza',
       source: 'local',
       roleIds: ['Admin'],
       isLocked: false, isVerified: true,
       insertDate: new Date().toISOString(),
       updateDate: new Date().toISOString(),
       groupIds: ['group1']
 
     }
     this.users.push(
       user1
     )
 
     const user2: User2 = {
       username: 'hamza2@ferrumgate.com',
       id: 'someid2',
       name: 'hamza2',
       source: 'google',
       roleIds: ['Admin'],
       isLocked: false, isVerified: true,
       insertDate: new Date().toISOString(),
       updateDate: new Date().toISOString(),
       groupIds: ['group2']
 
     }
     this.users.push(
       user2
     )
 
     const user3 = {
       ...user2
     }
     user3.id = 'someid3';
     user3.username = 'hamza3@ferrumgate.com';
     this.users.push(user3);
 
     const user4 = {
       ...user2
     }
     user4.id = 'someid4';
     user4.username = 'hamza4@ferrumgate.com';
     this.users.push(user4);
 
     let network: Network = {
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
     this.services.push(service);
 
     let service2: Service = {
       id: 's2',
       name: 'ssservice2', labels: ['test1'], host: '10.0.0.1',
       isEnabled: true, networkId: 'testNetworkId',
       protocol: 'raw', tcp: 80, udp: 80,
       assignedIp: '192.168.1.1'
     }
     this.services.push(service2);
     this.policies = [];
     this.policies.push({
       network: network,
       rules: [
         { id: 'rule1', name: 'rule1',  networkId: 'testNetworkId', serviceId: 's1', userOrgroupIds: ['someid2', 'group1'], profile: { is2FA: true }, isEnabled: true },
         { id: 'rule2', name: 'rule2',  networkId: 'testNetworkId', serviceId: 's1', userOrgroupIds: ['someid2', 'group1'], profile: { is2FA: true,  }, isEnabled: true }
       ]
     })
 
     this.policies.push({
       network: network,
       rules: [
         { id: 'rule2', name: 'rule2',  networkId: 'testNetworkId', serviceId: 's1', userOrgroupIds: ['someid2', 'group1'], profile: { is2FA: true,  }, isEnabled: true }
       ]
     }) */
    this.getAllData().subscribe();
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }


  getAllData() {
    return this.networkService.get2().pipe(
      map(y => {
        this.networks = y.items as any;
        this.performance.networks = new Map();
        this.networks.forEach(x => this.performance.networks.set(x.id, x))
      }),
      switchMap(y => this.serviceService.get2()),
      map(z => {
        this.services = z.items;
        this.performance.services = new Map();
        this.services.forEach(x => this.performance.services.set(x.id, x))
      }),
      switchMap(y => this.groupService.get2()),
      map(z => {
        this.groups = z.items;
        this.performance.groups = new Map();
        this.groups.forEach(x => this.performance.groups.set(x.id, x))
      }),
      switchMap(y => this.userService.get2(0, 0, '', [], [], [], [], undefined, undefined, undefined, undefined, 'simple')),
      map(z => {
        this.users = z.items;
        this.performance.users = new Map();
        this.users.forEach(x => this.performance.users.set(x.id, x))
      }),
      switchMap(y => this.policyAuthzService.get()),
      map(z => {
        this.policyAuthz = z;
        this.fillPolicy('');
      })


    )

  }
  fillPolicy(search: string) {
    this.policies = [];
    const fastmap = new Map();
    this.policyAuthz.rulesOrder.forEach((x, index) => {
      fastmap.set(x, index);
    });
    this.policyAuthz.rules.sort((a, b) => {
      return (fastmap.get(a.id) || 0) - (fastmap.get(b.id) || 0);
    })
    this.policyAuthz.rules.forEach(x => {
      if (!x.objId)
        x.objId = UtilService.randomNumberString()
    })

    if (!search) {
      this.networks.forEach(net => {
        const item = {
          network: net, rules: this.policyAuthz.rules.filter(x => x.networkId == net.id), isExpanded: false
        };
        this.policies.push(item)
      })
    } else {
      const filteredRules = this.policyAuthz.rules.filter(x => {
        if (x.name.toLowerCase().includes(search))
          return true;
        if (this.performance.networks.get(x.networkId)?.name.toLowerCase().includes(search))
          return true;
        if (this.performance.services.get(x.serviceId)?.name.toLowerCase().includes(search))
          return true;
        for (const userId of x.userOrgroupIds)
          if (this.performance.users.get(userId)?.username.toLowerCase().includes(search))
            return true;

        for (const userId of x.userOrgroupIds)
          if (this.performance.groups.get(userId)?.name.toLowerCase().includes(search))
            return true;
        return false;
      });

      const networkIds = new Set<string>();
      filteredRules.forEach(x => networkIds.add(x.networkId));
      this.networks.filter(x => x.name.toLowerCase().includes(search)).forEach(x => networkIds.add(x.id));
      networkIds.forEach(id => {
        const item = {
          network: this.performance.networks.get(id),
          rules: filteredRules.filter(x => x.networkId == id),
          isExpanded: false
        } as any;
        this.policies.push(item)
      })
    }
  }


  search() {
    let search = this.searchKey.length > 1 ? this.searchKey : '';
    this.fillPolicy(search.toLowerCase());
  }



  addNewRule(net: Network) {

    this.policies.find(x => x.network.id == net.id)?.rules.unshift({
      id: '', objId: UtilService.randomNumberString(), name: '', networkId: net.id, profile: {
        is2FA: false,
      }, serviceId: '', userOrgroupIds: [], isEnabled: true, isExpanded: true
    })
  }

  deleteAuthzRule($event: AuthorizationRule) {
    if (!$event.id) {//rule we created temporarily
      const item = this.policies.find(x => x.network.id == $event.networkId)
      if (item) {
        const index = item?.rules.findIndex(x => x.objId == $event.objId)
        if (index >= 0)
          item.rules.splice(index, 1);
      }

    } else {
      //real group execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.policyAuthzService.deleteRule($event)
        ),
      ).subscribe((x) => {
        //delete from policy rules
        const item = this.policies.find(x => x.network.id == $event.networkId);
        if (item) {
          const index = item.rules.findIndex(x => x.objId == $event.objId);
          const el = item.rules[index];
          item.rules.splice(index, 1);
          const bigIndex = this.policyAuthz.rules.findIndex(x => x.id == el.id);
          this.policyAuthz.rules.splice(bigIndex, 1);

        }
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }

  saveAuthzRule($event: AuthorizationRule) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.policyAuthzService.saveOrupdateRule($event)),
    ).subscribe((a) => {
      //find saved item and replace it
      const item = this.policies.find(x => x.network.id == $event.networkId);
      if (item) {
        const index = item.rules.findIndex(x => x.objId == $event.objId);
        const oldObj = item.rules[index];
        item.rules[index] = {
          ...a,
          objId: oldObj.objId,
          isExpanded: true
        }
        const bigIndex = this.policyAuthz.rules.findIndex(x => x.id == a.id);
        if (bigIndex < 0) {
          let i = this.policyAuthz.rules.findIndex(x => x.networkId == $event.networkId);
          this.policyAuthz.rules.splice(i, 0, { ...a, objId: oldObj.objId });
        }
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }

  dragDrop(event: any) {
    const previous = event.previousIndex;
    const currentIndex = event.currentIndex;
    const pol = event.container.data as Policy;
    if (previous != currentIndex) {
      const prev = pol.rules[previous];
      const cur = pol.rules[currentIndex];
      if (!cur.id || !prev.id) {
        this.notificationService.error(this.translateService.translate('PleaseSaveFirst'));
        return;
      }

      const backup = JSON.stringify(pol.rules);
      //find indexes in general list
      const previousGeneral = this.policyAuthz.rules.findIndex(x => x.objId == prev.objId);
      const prevGen = this.policyAuthz.rules[previousGeneral];
      const currentGeneral = this.policyAuthz.rules.findIndex(x => x.objId == cur.objId);
      pol.rules.splice(previous, 1);
      pol.rules.splice(currentIndex, 0, prev);
      this.policyAuthzService.reorderRule(prev, previousGeneral, cur.id, currentGeneral).
        pipe(catchError(err => {
          pol.rules = JSON.parse(backup);
          return throwError(() => err);
        })).subscribe(x => {

          this.policyAuthz.rules.splice(previousGeneral, 1);
          this.policyAuthz.rules.splice(currentGeneral, 0, prevGen);
        })
    }
  }

  isDragDisabled(pol: Policy) {
    if (this.searchKey) return true;
    return pol.rules.find(x => !x.id) ? true : false;
  }


}
