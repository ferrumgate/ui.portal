import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelect } from '@angular/material/select';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import validator from 'validator';
import { AuthenticationRule, cloneAuthenticationRule } from '../../models/authnPolicy';
import { cloneAuthenticationProfile, cloneTimeProfile, IpIntelligenceProfile, IpProfile, TimeProfile } from '../../models/authnProfile';
import { AuthorizationRule } from '../../models/authzPolicy';
import { Country } from '../../models/country';
import { Group } from '../../models/group';
import { IpIntelligenceList } from '../../models/ipIntelligence';
import { Network } from '../../models/network';
import { Service } from '../../models/service';
import { TimeZone } from '../../models/timezone';
import { User2 } from '../../models/user';
import { ConfigService } from '../../services/config.service';
import { InputService } from '../../services/input.service';
import { NotificationService } from '../../services/notification.service';
import { SSubscription } from '../../services/SSubscribtion';
import { TranslationService } from '../../services/translation.service';
import { UtilService } from '../../services/util.service';




export interface AuthenticationRuleExtended extends AuthenticationRule {
  orig: AuthenticationRule;
  isChanged: boolean;
  networkName: string;
  userOrGroups: { id: string, name: string }[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-policy-authn-rule',
  templateUrl: './policy-authn-rule.component.html',
  styleUrls: ['./policy-authn-rule.component.scss']
})
export class PolicyAuthnRuleComponent implements OnInit, OnDestroy {


  allSub = new SSubscription();
  helpLink = '';

  selectedTab = 0;


  _model: AuthenticationRuleExtended =
    {
      id: '', isChanged: false, name: '', networkId: '', profile: {
        is2FA: false,

      }, userOrgroupIds: [],
      orig: {
        id: '', name: '', networkId: '', profile: { is2FA: false, }, userOrgroupIds: [], isEnabled: true,
      },
      userOrGroups: [], networkName: '', isEnabled: true, isExpanded: false
    };
  @Input()
  dragDisabled = false;

  _users: User2[] = [];
  @Input()
  set users(val: User2[]) {
    this._users = val;
    this.prepareAutoCompletes();
  }
  get users() { return this._users };

  _groups: Group[] = [];
  @Input()
  set groups(val: Group[]) {
    this._groups = val;
    this.prepareAutoCompletes();
  }
  get groups() { return this._groups };

  get rule(): AuthenticationRuleExtended {
    return this._model;
  }
  get titleClass() {
    return 'allow';
  }

  _ipIntelligenceLists: IpIntelligenceList[] = [];
  @Input()
  set ipIntelligenceLists(val: IpIntelligenceList[]) {
    this._ipIntelligenceLists = val;
    this.prepareAutoCompleteIpIntelligenceLists();
  }
  get ipIntelligenceLists() { return this._ipIntelligenceLists; };


  countryMap = new Map();
  //country list
  /** list of country */
  @Input()
  public set countryList(val: Country[]) {

    this.countryMap = new Map();
    val.forEach(x => {
      this.countryMap.set(x.isoCode, x);
    })
    this._countryListAll = val;
    // set initial selection
    this.countryMultiCtrl.setValue([]);

    // load the initial country list
    this.filteredCountryListMulti.next(this._countryListAll.slice());
  }


  public get countryList() {
    return this._countryListAll;
  }

  @Input()
  networks: Network[] = [];

  @Input()
  set rule(val: AuthenticationRule) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      profile: cloneAuthenticationProfile(val.profile),
      userOrgroupIds: Array.from(val.userOrgroupIds || []),
      userOrGroups: this.findUsersOrGroups(val.userOrgroupIds),
      networkName: this.networks.find(x => x.id == val.networkId)?.name || '',
      isExpanded: val.isExpanded

    }
    if (!this._model.profile.ipIntelligence)
      this._model.profile.ipIntelligence = { blackLists: [], whiteLists: [], isCrawler: false, isHosting: false, isProxy: false };

    this._model.profile.ipIntelligence.blackListsEx = this.findIpIntelligenceLists(this._model.profile.ipIntelligence.blackLists);
    this._model.profile.ipIntelligence.whiteListsEx = this.findIpIntelligenceLists(this._model.profile.ipIntelligence.whiteLists);
    this.calculatesTimeProfiles(this._model.profile.times);

    this.prepareAutoCompletes();
    this.prepareAutoCompleteCountry();
    this.prepareAutoCompleteIpIntelligenceLists();
    this.formGroup = this.createFormGroup(this._model);

  }


  @Output()
  saveAuthnRule: EventEmitter<AuthenticationRule> = new EventEmitter();
  @Output()
  deleteAuthnRule: EventEmitter<AuthenticationRule> = new EventEmitter();


  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { name: string, } = { name: '' }
  filteredServices: Observable<Service[]> = of();
  filteredGroups: Group[] = [];
  filteredUsers: User2[] = [];

  isThemeDark = false;
  userorGroupControl = new FormControl();
  ipIntelligenceWhiteListControl = new FormControl();
  ipIntelligenceBlackListControl = new FormControl();
  filteredIpIntelligenceWhiteLists: IpIntelligenceList[] = [];
  filteredIpIntelligenceBlackLists: IpIntelligenceList[] = [];




  private _countryListAll: Country[] = [];

  /** control for the selected country for multi-selection */
  public countryMultiCtrl: FormControl = new FormControl([]);

  /** control for the MatSelect filter keyword multi-selection */
  public countryMultiFilterCtrl: FormControl = new FormControl('');

  /** list of country filtered by search keyword */
  public filteredCountryListMulti: ReplaySubject<Country[]> = new ReplaySubject<Country[]>(1);

  /** local copy of filtered country to help set the toggle all checkbox state */
  protected filteredCountryListCache: Country[] = [];
  isCountryListIndeterminate = false;
  isCountryListChecked = false;
  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;
  /** list of country filtered by search keyword */

  protected _onDestroy = new Subject<void>();

  get ipIntelligence(): IpIntelligenceProfile {
    if (!this._model.profile.ipIntelligence)
      this._model.profile.ipIntelligence = { isCrawler: false, isHosting: false, isProxy: false, blackLists: [], whiteLists: [] };
    return this._model.profile.ipIntelligence as IpIntelligenceProfile;
  }

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
    private notificationService: NotificationService
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })


    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.policyAuthnHelp;

  }



  _timezoneList: TimeZone[] = [];
  @Input()
  public set timezoneList(vals: TimeZone[]) {
    this._timezoneList = vals;

  }

  public get timezoneList() {
    return this._timezoneList;
  }

  ngOnInit(): void {
    this.prepareAutoCompletes();
    this.prepareAutoCompleteIpIntelligenceLists();



  }
  ngAfterViewInit() {
    this.setInitialValue();
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.allSub.unsubscribe();
  }


  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }
  simpleNameSort(a: any, b: any) {
    return a.name < b.name ? -1 : 1;
  }
  simpleUsernameSort(a: any, b: any) {
    return a.username < b.username ? -1 : 1;
  }
  findUsersOrGroups(ids: string[]) {
    const users = this.users.filter(x => ids.includes(x.id)).map(x => { return { id: x.id, isUser: true, name: x.username } });
    const groups = this.groups.filter(x => ids.includes(x.id)).map(x => { return { id: x.id, isUser: false, name: x.name } });
    groups.sort(this.simpleNameSort);
    users.sort(this.simpleUsernameSort);
    return groups.concat(users);
  }

  findIpIntelligenceLists(ids: string[]) {

    const lists = this.ipIntelligenceLists.filter(x => ids.includes(x.id)).map(x => { return { id: x.id, name: x.name } });
    lists.sort(this.simpleNameSort);

    return lists;
  }

  prepareAutoCompletes() {



    this.filteredUsers = this.users.sort(this.simpleUsernameSort)

    this.filteredGroups = this.groups.sort(this.simpleNameSort);
    this.allSub.addThis =
      this.userorGroupControl.valueChanges.subscribe(x => {
        const value = x;
        const val = typeof (x) === 'string' ? value.toLowerCase() : ''
        if (val) {
          this.filteredUsers = this.users.filter(x => x.username.toLowerCase().includes(val)).sort(this.simpleUsernameSort)
          this.filteredGroups = this.groups.filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
        } else {
          this.filteredUsers = this.users.sort(this.simpleUsernameSort)

          this.filteredGroups = this.groups.sort(this.simpleNameSort);
        }
      })


  }
  prepareAutoCompleteIpIntelligenceLists() {

    this.filteredIpIntelligenceWhiteLists = this.ipIntelligenceLists.sort(this.simpleNameSort);
    this.allSub.addThis =
      this.ipIntelligenceWhiteListControl.valueChanges.subscribe(x => {
        const value = x;
        const val = typeof (x) === 'string' ? value.toLowerCase() : ''
        if (val) {

          this.filteredIpIntelligenceWhiteLists = this.ipIntelligenceLists.filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
        } else {
          this.filteredIpIntelligenceWhiteLists = this.ipIntelligenceLists.sort(this.simpleNameSort);
        }

      })

    this.filteredIpIntelligenceBlackLists = this.ipIntelligenceLists.sort(this.simpleNameSort);
    this.allSub.addThis =
      this.ipIntelligenceBlackListControl.valueChanges.subscribe(x => {
        const value = x;
        const val = typeof (x) === 'string' ? value.toLowerCase() : ''
        if (val) {

          this.filteredIpIntelligenceBlackLists = this.ipIntelligenceLists.filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
        } else {
          this.filteredIpIntelligenceBlackLists = this.ipIntelligenceLists.sort(this.simpleNameSort);
        }

      })
  }
  prepareAutoCompleteCountry() {
    // set initial selection
    let selectedCountryList: Country[] = [];
    for (const loc of this.rule.profile.locations || []) {
      const country = this.countryMap.get(loc.countryCode);
      if (country)
        selectedCountryList.push(UtilService.clone(country));
    }

    this.countryMultiCtrl.setValue(selectedCountryList);

    // load the initial country list
    this.filteredCountryListMulti.next(this._countryListAll.slice());

    // listen for search field value changes
    this.allSub.addThis =
      this.countryMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {

          this.filterCountryListMulti();
          this.setToggleAllCheckboxStateCountryList();
        });

    // listen for multi select field value changes
    this.allSub.addThis =
      this.countryMultiCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy)).subscribe(() => {

          this.setToggleAllCheckboxStateCountryList();
          this.prepareCountryList();
        });
  }



  prepareCountryList() {
    this._model.profile.locations = (this.countryMultiCtrl.value as Country[]).map(x => {
      return {
        countryCode: x.isoCode
      }
    })
    this.modelChanged();

  }


  displayServiceFn(net: Service | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }



  displayUserOrGroupFn(net: User2 | Group | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || net?.username || '';
  }

  displayIpIntelligenceListFn(net: User2 | Group | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }


  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;


  removeUserOrGroup(ug: { id: string }): void {
    this.rule.userOrgroupIds = this.rule.userOrgroupIds.filter(x => x != ug.id);
    this.rule.userOrGroups = this.rule.userOrGroups.filter(x => x.id != ug.id);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

  userOrGroupSelected(event: any) {

    const value = event.option.value;
    if (value.id) {
      if (!this.rule.userOrgroupIds.includes(value.id)) {
        this.rule.userOrgroupIds.push(value.id);
        const items = this.findUsersOrGroups([value.id])
        this.rule.userOrGroups = this.rule.userOrGroups.concat(items);
        this.modelChanged();
      }
    }
  }




  modelChanged() {

    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.rule.isChanged = false;


  }



  createFormGroup(rule: AuthenticationRule) {
    const fmg = new FormGroup({
      name: new FormControl(rule.name, [Validators.required]),


    });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this._model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;
  }
  createFormError() {
    return { name: '', service: '' };
  }




  checkIfModelChanged() {
    this.rule.isChanged = false;
    const original = this._model.orig as AuthenticationRule;

    if (original.name != this.rule.name)
      this.rule.isChanged = true;


    if (UtilService.checkChanged(original.userOrgroupIds, this.rule.userOrgroupIds))
      this.rule.isChanged = true;
    if (original.isEnabled != this.rule.isEnabled)
      this.rule.isChanged = true;
    if (original.action != this.rule.action)
      this.rule.isChanged = true;

    if (original.profile.is2FA != this.rule.profile.is2FA)
      this.rule.isChanged = true;
    if (UtilService.checkChanged(original.profile.whiteListIps?.map(x => x.ip), this.rule.profile.whiteListIps?.map(x => x.ip)))
      this.rule.isChanged = true;
    if (UtilService.checkChanged(original.profile.blackListIps?.map(x => x.ip), this.rule.profile.blackListIps?.map(x => x.ip)))
      this.rule.isChanged = true;

    if (UtilService.checkChanged(original.profile.ipIntelligence?.blackLists?.map(x => x), this.rule.profile.ipIntelligence?.blackLists?.map(x => x)))
      this.rule.isChanged = true;
    if (UtilService.checkChanged(original.profile.ipIntelligence?.whiteLists?.map(x => x), this.rule.profile.ipIntelligence?.whiteLists?.map(x => x)))
      this.rule.isChanged = true;

    if (UtilService.checkUndefinedBoolean(original.profile.ipIntelligence?.isCrawler, this.rule.profile.ipIntelligence?.isCrawler))
      this.rule.isChanged = true;
    if (UtilService.checkUndefinedBoolean(original.profile.ipIntelligence?.isHosting, this.rule.profile.ipIntelligence?.isHosting))
      this.rule.isChanged = true;
    if (UtilService.checkUndefinedBoolean(original.profile.ipIntelligence?.isProxy, this.rule.profile.ipIntelligence?.isProxy))
      this.rule.isChanged = true;
    if (UtilService.checkChanged(original.profile.locations?.map(x => x.countryCode), this.rule.profile.locations?.map(x => x.countryCode)))
      this.rule.isChanged = true;

    if (UtilService.checkChanged(
      original.profile.times?.map(x => this.calculateTimeProfileName(x)),
      this.rule.profile.times?.map(x => this.calculateTimeProfileName(x))))
      this.rule.isChanged = true;



  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();

    const nameError = this.formGroup.controls.name.errors;

    if (nameError) {
      if (nameError['required'])
        error.name = 'NameRequired';
      else
        error.name = 'NameRequired';
    }




    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as AuthenticationRule;

    this.rule = {
      ...original,
      profile: cloneAuthenticationProfile(original.profile)
    }

    this.checkIfModelChanged();
  }
  createBaseModel(): AuthenticationRule {
    return {
      id: this._model.id,
      objId: this._model.objId,
      name: this._model.name,
      networkId: this._model.networkId,
      userOrgroupIds: Array.from(this._model.userOrgroupIds),
      profile: cloneAuthenticationProfile(this._model.profile),
      isEnabled: this._model.isEnabled,
      action: this._model.action
    }
  }


  saveOrUpdate() {
    this.saveAuthnRule.emit(this.createBaseModel());
  }



  delete() {
    this.deleteAuthnRule.emit(this.createBaseModel());
  }

  getExplanationUser() {
    if (this.rule.userOrGroups.length)
      return `${this.rule.userOrGroups.map(x => x.name).join(', ')}`;
    else return `all`
  }

  getExplanationIps() {

    const whitelist = []
    if (this.rule.profile.whiteListIps?.length)
      whitelist.push(`in ${this.rule.profile.whiteListIps.map(x => x.ip).join(', ')}`);

    if (this.rule.profile.ipIntelligence?.whiteListsEx?.length)
      whitelist.push(`in ${this.rule.profile.ipIntelligence.whiteListsEx.map(x => x.name).join(', ')}`);

    if (this.rule.profile.locations?.length)
      whitelist.push(`from ${this.rule.profile.locations.slice(0, 3).map(x => x.countryCode).join(',') + `${this.rule.profile.locations.length > 3 ? ' ...' : ''}`}`);


    const blacklist = [];
    if (this.rule.profile.blackListIps?.length)
      blacklist.push(`not in ${this.rule.profile.blackListIps.map(x => x.ip).join(', ')}`);

    if (this.rule.profile.ipIntelligence?.blackListsEx?.length)
      blacklist.push(`not in ${this.rule.profile.ipIntelligence.blackListsEx.map(x => x.name).join(', ')}`);

    if (this.rule.profile.ipIntelligence?.isProxy)
      blacklist.push(`from a proxy`);
    if (this.rule.profile.ipIntelligence?.isCrawler)
      blacklist.push(`from a crawler`);
    if (this.rule.profile.ipIntelligence?.isHosting)
      blacklist.push(`from a hosting`);

    if (!whitelist.length && !blacklist.length)
      return `all ips`;

    let result = whitelist.join(' or ');
    if (blacklist.length)
      result += (whitelist.length ? ' or ' : '') + blacklist.join(' or ');

    return 'ip ' + result;
  }

  getExplanationTimes() {

    if (this.rule.profile.times?.length)
      return `time is in ${this.rule.profile.times.slice(0, 3).map(x => x.timezone).join(' or ') + `${this.rule.profile.times.length > 3 ? ' ...' : ''}`}`
    return ``;
  }


  getExplanationSummary() {
    let ips = this.rule.profile.whiteListIps?.map(x => x.ip).join(',').substring(0, 30) || '';
    if (ips)
      ips = `{${ips}},`
    let users = this.rule.userOrGroups.map(x => x.name).join(', ').substring(0, 60);
    if (users) {
      users = `{${users}...},`
    }
    return `{${this.rule.name}}, 
    {${this.rule.isEnabled ? 'enabled' : 'not enabled'}}, 
    ${users} 
    ${this.rule.profile.is2FA ? ' {2FA},' : ''} 
    ${ips}`
  }



  removeIpIntelligenceWhiteList(ug: { id: string }): void {
    if (this.rule.profile.ipIntelligence?.whiteLists && this.rule.profile.ipIntelligence?.whiteListsEx) {
      this.rule.profile.ipIntelligence.whiteLists = this.rule.profile.ipIntelligence.whiteLists.filter(x => x != ug.id);
      this.rule.profile.ipIntelligence.whiteListsEx = this.rule.profile.ipIntelligence.whiteListsEx.filter(x => x.id != ug.id);
      if (this.formGroup.valid)
        this.checkIfModelChanged();
    }

  }

  removeIpIntelligenceBlackList(ug: { id: string }): void {
    if (this.rule.profile.ipIntelligence?.blackLists && this.rule.profile.ipIntelligence?.blackListsEx) {
      this.rule.profile.ipIntelligence.blackLists = this.rule.profile.ipIntelligence.blackLists.filter(x => x != ug.id);
      this.rule.profile.ipIntelligence.blackListsEx = this.rule.profile.ipIntelligence.blackListsEx.filter(x => x.id != ug.id);
      if (this.formGroup.valid)
        this.checkIfModelChanged();
    }

  }

  ipIntelligenceWhiteListSelected(event: any) {

    const value = event.option.value;
    if (value.id) {
      if (!this.rule.profile.ipIntelligence?.whiteLists.includes(value.id)) {

        this.rule.profile.ipIntelligence?.whiteLists.push(value.id);
        //
        const items = this.findIpIntelligenceLists([value.id])
        if (this.rule.profile.ipIntelligence && !this.rule.profile.ipIntelligence?.whiteListsEx)
          this.rule.profile.ipIntelligence.whiteListsEx = [];
        if (this.rule.profile.ipIntelligence && this.rule.profile.ipIntelligence.whiteListsEx)
          this.rule.profile.ipIntelligence.whiteListsEx = this.rule.profile.ipIntelligence.whiteListsEx.concat(items);

        this.modelChanged();
      }
    }
  }

  ipIntelligenceBlackListSelected(event: any) {

    const value = event.option.value;
    if (value.id) {
      if (!this.rule.profile.ipIntelligence?.blackLists.includes(value.id)) {

        this.rule.profile.ipIntelligence?.blackLists.push(value.id);
        //
        const items = this.findIpIntelligenceLists([value.id])
        if (this.rule.profile.ipIntelligence && !this.rule.profile.ipIntelligence?.blackListsEx)
          this.rule.profile.ipIntelligence.blackListsEx = [];
        if (this.rule.profile.ipIntelligence && this.rule.profile.ipIntelligence.blackListsEx)
          this.rule.profile.ipIntelligence.blackListsEx = this.rule.profile.ipIntelligence.blackListsEx.concat(items);

        this.modelChanged();
      }
    }
  }






  addIpOrCidrWhiteList(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this.rule.profile.whiteListIps?.find(x => x.ip == value);
      if (!isExits) {
        if (!this.rule.profile.whiteListIps)
          this.rule.profile.whiteListIps = [];
        if (validator.isIP(value)) {
          if (validator.isIP(value, 4))
            value += '/32';
          else
            value += '/128';
        }
        if (validator.isIPRange(value))
          this.rule.profile.whiteListIps.push({ ip: value });
      }
    }

    // Clear the input value
    if (validator.isIPRange(value))
      event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  addIpOrCidrBlackList(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this.rule.profile.blackListIps?.find(x => x.ip == value);
      if (!isExits) {
        if (!this.rule.profile.blackListIps)
          this.rule.profile.blackListIps = [];
        if (validator.isIP(value)) {
          if (validator.isIP(value, 4))
            value += '/32';
          else
            value += '/128';
        }
        if (validator.isIPRange(value))
          this.rule.profile.blackListIps.push({ ip: value });
      }
    }

    // Clear the input value
    if (validator.isIPRange(value))
      event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeIpOrCidrWhiteList(label: IpProfile): void {
    this.rule.profile.whiteListIps = this.rule.profile.whiteListIps?.filter(x => x.ip != label.ip);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

  removeIpOrCidrBlackList(label: IpProfile): void {
    this.rule.profile.blackListIps = this.rule.profile.blackListIps?.filter(x => x.ip != label.ip);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }



  toggleSelectAllCountryList(selectAllValue: boolean) {
    this.filteredCountryListMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.countryMultiCtrl.patchValue(val);
        } else {
          this.countryMultiCtrl.patchValue([]);
        }
      });
  }

  /**
  * Sets the initial value after the filteredCountrys are loaded initially
  */
  protected setInitialValue() {
    this.filteredCountryListMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredCountrys are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Country, b: Country) => a && b && a.name === b.name;
      });
  }

  protected filterCountryListMulti() {
    if (!this._countryListAll) {
      return;
    }
    // get the search keyword
    let search = this.countryMultiFilterCtrl.value;
    if (!search) {
      this.filteredCountryListCache = this._countryListAll.slice();
      this.filteredCountryListMulti.next(this.filteredCountryListCache);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the countrys
    this.filteredCountryListCache = this._countryListAll.filter(country => country.name.toLowerCase().indexOf(search) > -1);
    this.filteredCountryListMulti.next(this.filteredCountryListCache);
  }

  protected setToggleAllCheckboxStateCountryList() {
    let filteredLength = 0;
    if (this.countryMultiCtrl && this.countryMultiCtrl.value) {
      this.filteredCountryListCache.forEach(el => {
        if (this.countryMultiCtrl.value.indexOf(el) > -1) {
          filteredLength++;
        }
      });
      this.isCountryListIndeterminate = filteredLength > 0 && filteredLength < this.filteredCountryListCache.length;
      this.isCountryListChecked = filteredLength > 0 && filteredLength === this.filteredCountryListCache.length;
    }
  }

  showAddTime = false;
  showHideAddTime() {
    this.showAddTime = !this.showAddTime;
  }

  minuteToHour(m: number) {
    const hour = Math.floor(m / 60);
    const minute = m - hour * 60;
    let hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    let minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
    return hourStr + ':' + minuteStr;
  }

  calculateTimeProfileName(pf: TimeProfile) {
    const days = pf.days.sort((a, b) => a - b);
    let day = '';
    days.forEach(x => {
      switch (x) {
        case 0:
          day += 'S ';
          break;
        case 1:
          day += 'M ';
          break;
        case 2:
          day += 'T ';
          break;
        case 3:
          day += 'W ';
          break;
        case 4:
          day += 'TH ';
          break;
        case 5:
          day += 'F ';
          break;
        case 6:
          day += 'SA ';
          break;
        default:
          break;
      }
    })
    let start = '00:00';
    let end = '23:59';
    if (pf.startTime)
      start = this.minuteToHour(pf.startTime);
    if (pf.endTime)
      end = this.minuteToHour(pf.endTime);
    const txt = `${pf.timezone} ${day} ${start} - ${end}`;
    return txt;
  }

  calculatesTimeProfiles(times?: TimeProfile[]) {
    if (!times)
      return;
    times.forEach(x => {
      x.name = this.calculateTimeProfileName(x);
      x.objId = UtilService.randomNumberString();
    })
  }

  removeTimeProfile(objId: string) {
    if (this.rule.profile.times) {
      const index = this.rule.profile.times?.findIndex(x => x.objId == objId)
      if (index > -1) {
        this.rule.profile.times?.splice(index, 1);
      }
    }
    this.modelChanged();
  }

  addTimeProfile(event: TimeProfile) {

    const cloned = cloneTimeProfile(event);
    if (!this.rule.profile.times)
      this.rule.profile.times = [];
    cloned.name = this.calculateTimeProfileName(cloned);
    cloned.objId = UtilService.randomNumberString();
    if (!this.rule.profile.times.find(x => x.name == cloned.name))
      this.rule.profile.times.push(cloned);
    this.modelChanged();
  }




}


