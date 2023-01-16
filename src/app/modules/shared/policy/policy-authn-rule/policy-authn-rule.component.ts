import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of } from 'rxjs';
import validator from 'validator';
import { AuthenticationRule, cloneAuthenticationRule } from '../../models/authnPolicy';
import { cloneAuthenticationProfile, IpProfile } from '../../models/authnProfile';
import { AuthorizationRule } from '../../models/authzPolicy';
import { Group } from '../../models/group';
import { Network } from '../../models/network';
import { Service } from '../../models/service';
import { User2 } from '../../models/user';
import { ConfigService } from '../../services/config.service';
import { InputService } from '../../services/input.service';
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


  _model: AuthenticationRuleExtended =
    {
      id: '', isChanged: false, name: '', networkId: '', profile: {
        is2FA: false,

      }, userOrgroupIds: [], action: 'allow',
      orig: {
        id: '', name: '', networkId: '', profile: { is2FA: false, }, userOrgroupIds: [], isEnabled: true, action: 'allow'
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
    return this.rule.action != 'allow' ? 'deny' : ''
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
    debugger;
    this.prepareAutoCompletes();
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

    this.helpLink = this.configService.links.policyAuthnHelp;

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
    if (UtilService.checkChanged(original.profile.ips?.map(x => x.ip), this.rule.profile.ips?.map(x => x.ip)))
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
    if (this.rule.profile.ips?.length)
      return `${this.rule.profile.ips.map(x => x.ip).join(', ')}`;
    else return `all ips`
  }


  getExplanationSummary() {
    let ips = this.rule.profile.ips?.map(x => x.ip).join(',').substring(0, 30) || '';
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
    ${ips} 
    {${this.rule.action}}`
  }

  ruleActionChanged($event: any) {
    this.rule.action = this.rule.action === 'allow' ? 'deny' : 'allow';
    this.modelChanged();
  }



  addIpOrCidr(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this.rule.profile.ips?.find(x => x.ip == value);
      if (!isExits) {
        if (!this.rule.profile.ips)
          this.rule.profile.ips = [];
        if (validator.isIP(value) || validator.isIPRange(value))
          this.rule.profile.ips.push({ ip: value });
      }
    }

    // Clear the input value
    if (validator.isIP(value) || validator.isIPRange(value))
      event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeIpOrCidr(label: IpProfile): void {
    this.rule.profile.ips = this.rule.profile.ips?.filter(x => x.ip != label.ip);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }







}
