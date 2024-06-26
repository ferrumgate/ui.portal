import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationRule } from '../../models/authzPolicy';
import { FqdnIntelligenceProfile } from '../../models/authzProfile';
import { FqdnIntelligenceCategory, FqdnIntelligenceList } from '../../models/fqdnIntelligence';
import { Group } from '../../models/group';
import { Network } from '../../models/network';
import { Service } from '../../models/service';
import { User2 } from '../../models/user';
import { SSubscription } from '../../services/SSubscribtion';
import { ConfigService } from '../../services/config.service';
import { TranslationService } from '../../services/translation.service';
import { UtilService } from '../../services/util.service';
import { PolicyAuthzRuleFqdnComponent } from './policy-authz-rule-fqdn/policy-authz-rule-fqdn.component';

export interface AuthorizationRuleExtended extends AuthorizationRule {
  orig: AuthorizationRule;
  isChanged: boolean;
  serviceName: string;
  networkName: string;
  userOrGroups: { id: string, name: string }[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-policy-authz-rule',
  templateUrl: './policy-authz-rule.component.html',
  styleUrls: ['./policy-authz-rule.component.scss']
})
export class PolicyAuthzRuleComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();
  helpLink = '';

  _model: AuthorizationRuleExtended =
    {
      id: '', isChanged: false, name: '', networkId: '', profile: { is2FA: false }, serviceId: '', userOrgroupIds: [],
      orig: {
        id: '', name: '', networkId: '', profile: { is2FA: false, }, serviceId: '', userOrgroupIds: [], isEnabled: true
      },
      serviceName: '', userOrGroups: [], networkName: '', isEnabled: true, isExpanded: false
    };

  @Input()
  dragDisabled = false;

  _services: Service[] = [];
  @Input()
  set services(val: Service[]) {
    this._services = val;
    this.prepareAutoCompletes();
  }

  get services() { return this._services };

  _users: User2[] = [];
  @Input()
  set users(val: User2[]) {
    this._users = val;
    this.prepareAutoCompletes();
  }
  get users() { return this._users };

  // groups
  _groups: Group[] = [];
  @Input()
  set groups(val: Group[]) {
    this._groups = val;
    this.prepareAutoCompletes();
  }
  get groups() { return this._groups };

  //fqnd list
  _fqdnIntelligenceLists: FqdnIntelligenceList[] = [];
  @Input()
  set fqdnIntelligenceLists(val: FqdnIntelligenceList[]) {
    this._fqdnIntelligenceLists = val;
  }
  get fqdnIntelligenceLists() { return this._fqdnIntelligenceLists };

  //fqdn category list
  _fqdnIntelligenceCategoryLists: FqdnIntelligenceCategory[] = [];
  @Input()
  set fqdnIntelligenceCategoryLists(val: FqdnIntelligenceCategory[]) {
    this._fqdnIntelligenceCategoryLists = val;
  }
  get fqdnIntelligenceCategoryLists() { return this._fqdnIntelligenceCategoryLists };

  get rule(): AuthorizationRuleExtended {
    return this._model;
  }

  @Input()
  networks: Network[] = [];

  @Input()
  set rule(val: AuthorizationRule) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      profile: {
        ...val.profile
      },
      userOrgroupIds: Array.from(val.userOrgroupIds || []),
      serviceName: this.services.find(x => x.id == val.serviceId)?.name || '',
      userOrGroups: this.findUsersOrGroups(val.userOrgroupIds),
      networkName: this.networks.find(x => x.id == val.networkId)?.name || '',
      isExpanded: val.isExpanded

    }

    this.prepareAutoCompletes();
    this.formGroup = this.createFormGroup(this._model);
    this.selectedService = this.services.find(x => x.id == val.serviceId) || null;
    this.defaultFqdnIntelligence = this.createDefaultFqdnIntelligenceProfile()
  }

  defaultFqdnIntelligence: FqdnIntelligenceProfile = this.createDefaultFqdnIntelligenceProfile()

  createDefaultFqdnIntelligenceProfile() {
    return {
      blackFqdns: [],
      blackLists: [],
      ignoreFqdns: [],
      ignoreLists: [],
      whiteFqdns: [],
      whiteLists: [],
    }

  }

  @Output()
  saveAuthzRule: EventEmitter<AuthorizationRule> = new EventEmitter();
  @Output()
  deleteAuthzRule: EventEmitter<AuthorizationRule> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { name: string, service: string } = { name: '', service: '' }
  filteredServices: Service[] = [];
  filteredGroups: Group[] = [];
  filteredUsers: User2[] = [];

  isThemeDark = false;
  userorGroupControl = new FormControl();
  servicesControl = new FormControl();

  @ViewChild(PolicyAuthzRuleFqdnComponent) fqdnIntelligenceComponent!: PolicyAuthzRuleFqdnComponent;
  fqdnIntelligenceChanged = false;

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.policyAuthzHelp;

  }

  ngOnInit(): void {
    this.prepareAutoCompletes();

  }
  ngOnDestroy(): void {
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
  prepareAutoCompletes() {

    this.filteredServices = this.services.filter(x => x.networkId == this.rule.networkId).sort(this.simpleNameSort);

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

  selectedService: Service | null = null;
  serviceChanged(event: any) {

    if (event?.option?.value) {
      this.rule.serviceId = event.option.value.id;
      this.selectedService = this.services.find(x => x.id == this.rule.serviceId) || null;
      this.formGroup.controls.serviceId.setValue(this.rule.serviceId);
      if (this.rule.serviceId)
        this.rule.serviceName = event.option.value.name;
      else
        this.rule.serviceName = ''
      this.modelChanged();

    } else {
      this.selectedService = null;
      this.rule.serviceId = '';
      this.rule.serviceName = '';
      this.formGroup.controls.serviceId.setValue('');
      this.modelChanged();
    }

  }
  searchService(ev: any) {
    if (typeof (ev) == 'string') {
      if (ev) {
        this.filteredServices = this.services.filter(x => x.networkId == this.rule.networkId).filter(x => x.name.toLowerCase().includes(ev)).sort(this.simpleNameSort);
      } else {
        this.filteredServices = this.services.filter(x => x.networkId == this.rule.networkId).sort(this.simpleNameSort);
      }
    }
  }

  displayServiceFn(net: Service | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }

  displayUserOrGroupFn(net: User2 | Group | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || net?.username || '';
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

  createFormGroup(rule: AuthorizationRule) {
    const fmg = new FormGroup({
      name: new FormControl(rule.name, [Validators.required]),
      serviceId: new FormControl(rule.serviceId, [Validators.required])

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

  selectedTab = 0;

  checkIfModelChanged() {
    this.rule.isChanged = false;
    const original = this._model.orig as AuthorizationRule;

    if (original.name != this.rule.name)
      this.rule.isChanged = true;
    if (original.profile.is2FA != this.rule.profile.is2FA)
      this.rule.isChanged = true;
    if (original.serviceId != this.rule.serviceId)
      this.rule.isChanged = true;
    if (UtilService.checkChanged(original.userOrgroupIds, this.rule.userOrgroupIds))
      this.rule.isChanged = true;
    if (original.isEnabled != this.rule.isEnabled)
      this.rule.isChanged = true;
    if (this.fqdnIntelligenceChanged)
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

    const serviceError = this.formGroup.controls.serviceId.errors;

    if (serviceError) {
      if (serviceError['required'])
        error.service = 'ServiceRequired';
      else
        error.service = 'ServiceRequired';
    }

    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this._model.isChanged = false;
    const original = this._model.orig as AuthorizationRule;

    this.rule = {
      ...original,
      profile: {
        ...original.profile
      }
    }
    this.fqdnIntelligenceChanged = false;
    this.checkIfModelChanged();
  }
  createBaseModel(): AuthorizationRule {
    let item: AuthorizationRule = {
      id: this._model.id,
      objId: this._model.objId,
      name: this._model.name,
      networkId: this._model.networkId,
      serviceId: this._model.serviceId,
      userOrgroupIds: Array.from(this._model.userOrgroupIds),
      profile: { ...this._model.profile },
      isEnabled: this._model.isEnabled
    }

    if (this.fqdnIntelligenceComponent && this.fqdnIntelligenceChanged)
      item.profile.fqdnIntelligence = this.fqdnIntelligenceComponent.createBaseModel()

    return item;
  }

  saveOrUpdate() {
    this.saveAuthzRule.emit(this.createBaseModel());
  }

  delete() {
    this.deleteAuthzRule.emit(this.createBaseModel());
  }

  getExplanationUser() {
    if (this.rule.userOrGroups.length)
      return `${this.rule.userOrGroups.map(x => x.name).join(', ')}`;
    else return `all`
  }

  getExplanationSummary() {
    return `${this.rule.name}, ${this.rule.isEnabled ? 'enabled' : 'not enabled'}, ${this.rule.serviceName}, ${this.rule.userOrGroups.map(x => x.name).join(', ').substring(0, 60)}... ${this.rule.profile.is2FA ? ', 2FA' : ''}`
  }

  isServiceDns() {
    if (!this.selectedService) return false;
    return this.selectedService.protocol == 'dns';
  }

  handleFqdnIntelligenceChanged(ev: boolean) {

    this.fqdnIntelligenceChanged = ev;
    this.checkIfModelChanged();
  }

}
