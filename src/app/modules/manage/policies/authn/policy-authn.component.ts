import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { ConfigService } from '../../../shared/services/config.service';
import { SSubscription } from '../../../shared/services/SSubscribtion';


import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeWhile, throwError } from 'rxjs';
import { Group } from 'src/app/modules/shared/models/group';
import { User2 } from 'src/app/modules/shared/models/user';
import { NetworkService } from 'src/app/modules/shared/services/network.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { AuthorizationPolicy, AuthorizationRule } from '../../../shared/models/authzPolicy';
import { Network } from '../../../shared/models/network';
import { Service } from '../../../shared/models/service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslationService } from '../../../shared/services/translation.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { PolicyAuthnService } from 'src/app/modules/shared/services/policyAuthn.service';
import { AuthenticationPolicy, AuthenticationRule } from 'src/app/modules/shared/models/authnPolicy';
import { Country } from 'src/app/modules/shared/models/country';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { TimeZone } from 'src/app/modules/shared/models/timezone';
import { IpIntelligenceList } from 'src/app/modules/shared/models/ipIntelligence';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';




interface Policy {
  network: Network, rules: AuthenticationRule[], isExpanded: boolean
}

@Component({
  selector: 'app-policy-authn',
  templateUrl: './policy-authn.component.html',
  styleUrls: ['./policy-authn.component.scss']
})
export class PolicyAuthnComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();
  networkFormControl = new FormControl();

  networks: Network[] = [];
  users: User2[] = [];
  groups: Group[] = [];

  performance: {
    users: Map<string, User2>,
    groups: Map<string, Group>,
    networks: Map<string, Network>
  } = {

  } as any;

  policies: Policy[] = [{
    network: { id: '' } as any, rules: [], isExpanded: false
  }]
  policyAuthn: AuthenticationPolicy = { rules: [] } as any;
  countryList: Country[] = [];
  ipIntelligenceList: IpIntelligenceList[] = [];
  helpLink = '';
  isThemeDark = false;
  searchKey = '';
  timezoneList: TimeZone[] = [];
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private networkService: NetworkService,
    private userService: UserService,
    private groupService: GroupService,
    private policyAuthnService: PolicyAuthnService,
    private dataService: DataService,
    private ipIntelligenceService: IpIntelligenceService

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

    /* this.groups.push({ id: 'group1', name: 'North1', isEnabled: true, labels: [] })
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

    this.policies = [];
    this.policies.push({
      network: network, isExpanded: true,
      rules: [
        { id: 'rule1', objId: UtilService.randomNumberString(), name: 'rule1',  networkId: 'testNetworkId', userOrgroupIds: ['someid2', 'group1'], profile: { is2FA: true }, isEnabled: true, },

        { id: 'rule2', objId: UtilService.randomNumberString(), name: 'rule2',  networkId: 'testNetworkId', userOrgroupIds: ['someid2', 'group1'], profile: { is2FA: true }, isEnabled: true, isExpanded: true }
      ]
    })

    this.policies.push({
      network: network, isExpanded: false,
      rules: [
        { id: 'rule2', objId: UtilService.randomNumberString(), name: 'rule2',  networkId: 'testNetworkId', userOrgroupIds: ['someid2', 'group1'], profile: { is2FA: true, ips: [] }, isEnabled: true, }
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
  offsetToHour(offset: number) {
    const absOffset = Math.abs(offset);
    const first = Math.floor(absOffset / 60);
    const second = absOffset - (first * 60);
    let offsetHour = offset < 0 ? '+' : offset == 0 ? '' : '-';
    offsetHour += first < 10 ? '0' + first : first;
    offsetHour += ":";
    offsetHour += second < 10 ? '0' + second : second;
    return offsetHour;
  }

  getAllData() {
    return this.dataService.getCountry().pipe(
      map(y => {
        this.countryList = y.items.sort((a, b) => a.name.localeCompare(b.name)) as any;
      }),
      switchMap(y => this.dataService.getTimeZone()),
      map(y => {
        this.timezoneList = y.items.sort((a, b) => a.name.localeCompare(b.name)) as any;

        this.timezoneList.forEach(x => {
          x.offsetHour = this.offsetToHour(x.offset);
          x.nameEx = x.name + ' ' + x.offsetHour;
        })
      }),
      switchMap(y => this.ipIntelligenceService.getList('')),
      map(y => this.ipIntelligenceList = y.items),
      switchMap(y => this.networkService.get2()),
      map(y => {
        this.networks = y.items as any;
        this.performance.networks = new Map();
        this.networks.forEach(x => this.performance.networks.set(x.id, x))
      }),
      switchMap(y => this.groupService.get2()),
      map(z => {
        this.groups = z.items;
        this.performance.groups = new Map();
        this.groups.forEach(x => this.performance.groups.set(x.id, x))
      }),
      switchMap(y => this.userService.get2(0, 0, '', [], [], [], undefined, undefined, undefined, undefined, 'simple')),
      map(z => {
        this.users = z.items;
        this.performance.users = new Map();
        this.users.forEach(x => this.performance.users.set(x.id, x))
      }),
      switchMap(y => this.policyAuthnService.get()),
      map(z => {
        this.policyAuthn = z;
        this.fillPolicy('');
      })
    )

  }
  fillPolicy(search: string) {
    this.policies = [];
    const fastmap = new Map();
    this.policyAuthn.rulesOrder.forEach((x, index) => {
      fastmap.set(x, index);
    });
    this.policyAuthn.rules.sort((a, b) => {
      return (fastmap.get(a.id) || 0) - (fastmap.get(b.id) || 0);
    })
    this.policyAuthn.rules.forEach(x => {
      if (!x.objId)
        x.objId = UtilService.randomNumberString();
    })
    if (!search) {
      this.networks.forEach(net => {
        const item = {
          network: net, rules: this.policyAuthn.rules.filter(x => x.networkId == net.id), isExpanded: false
        };
        this.policies.push(item)
      })
    } else {
      const filteredRules = this.policyAuthn.rules.filter(x => {
        if (x.name.toLowerCase().includes(search))
          return true;
        if (this.performance.networks.get(x.networkId)?.name.toLowerCase().includes(search))
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
        is2FA: false, ipIntelligence: { isCrawler: true, isHosting: true, isProxy: true, blackLists: [], whiteLists: [] }
      }, serviceId: '', userOrgroupIds: [], isEnabled: true, isExpanded: true,
    })
  }

  deleteAuthnRule($event: AuthenticationRule) {
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
          this.policyAuthnService.deleteRule($event)
        ),
      ).subscribe((x) => {
        //delete from policy rules
        const item = this.policies.find(x => x.network.id == $event.networkId);
        if (item) {
          const index = item.rules.findIndex(x => x.objId == $event.objId);
          const el = item.rules[index];
          item.rules.splice(index, 1);
          const bigIndex = this.policyAuthn.rules.findIndex(x => x.id == el.id);
          this.policyAuthn.rules.splice(bigIndex, 1);
        }
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }

  saveAuthnRule($event: AuthenticationRule) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.policyAuthnService.saveOrupdateRule($event)),
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
        const bigIndex = this.policyAuthn.rules.findIndex(x => x.id == a.id);
        if (bigIndex < 0) {
          let i = this.policyAuthn.rules.findIndex(x => x.networkId == $event.networkId);
          this.policyAuthn.rules.splice(i, 0, { ...a, objId: oldObj.objId });
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
      const previousGeneral = this.policyAuthn.rules.findIndex(x => x.objId == prev.objId);
      const prevGen = this.policyAuthn.rules[previousGeneral];
      const currentGeneral = this.policyAuthn.rules.findIndex(x => x.objId == cur.objId);
      pol.rules.splice(previous, 1);
      pol.rules.splice(currentIndex, 0, prev);
      this.policyAuthnService.reorderRule(prev, previousGeneral, cur.id, currentGeneral).
        pipe(catchError(err => {
          pol.rules = JSON.parse(backup);
          return throwError(() => err);
        })).subscribe(x => {

          this.policyAuthn.rules.splice(previousGeneral, 1);
          this.policyAuthn.rules.splice(currentGeneral, 0, prevGen);
        })
    }
  }

  isDragDisabled(pol: Policy) {
    if (this.searchKey) return true;
    return pol.rules.find(x => !x.id) ? true : false;
  }


}
