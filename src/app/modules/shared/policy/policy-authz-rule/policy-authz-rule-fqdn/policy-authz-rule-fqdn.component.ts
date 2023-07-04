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
import { FqdnIntelligenceProfile, FqdnProfile } from '../../../models/authzProfile';
import { SSubscription } from '../../../services/SSubscribtion';
import { FqdnIntelligenceCategory, FqdnIntelligenceList } from '../../../models/fqdnIntelligence';
import { ConfigService } from '../../../services/config.service';
import { TranslationService } from '../../../services/translation.service';
import { NotificationService } from '../../../services/notification.service';
import { UtilService } from '../../../services/util.service';
import { IpIntelligence } from '../../../models/ipIntelligence';





export interface FqdnIntelligenceProfileExtended extends FqdnIntelligenceProfile {
  orig: FqdnIntelligenceProfile;
  isChanged: boolean;

}

@Component({
  selector: 'app-policy-authz-rule-fqdn',
  templateUrl: './policy-authz-rule-fqdn.component.html',
  styleUrls: ['./policy-authz-rule-fqdn.component.scss']
})
export class PolicyAuthzRuleFqdnComponent implements OnInit, OnDestroy {


  allSub = new SSubscription();
  helpLink = '';

  selectedTab = 0;

  _model: FqdnIntelligenceProfileExtended = {
    blackFqdns: [], blackLists: [], ignoreFqdns: [], ignoreLists: [], isChanged: false,
    whiteFqdns: [], whiteLists: [],
    whiteListsEx: [], blackListsEx: [], ignoreListsEx: [],
    orig: {
      blackFqdns: [], blackLists: [], ignoreFqdns: [], ignoreLists: [],
      whiteFqdns: [], whiteLists: [],
    }
  };
  get model(): FqdnIntelligenceProfileExtended {
    return this._model;
  }


  @Input()
  set model(val: FqdnIntelligenceProfile) {
    this._model = {
      ...UtilService.clone(val),
      isChanged: false,
      orig: val,
      whiteListsEx: this.findLists(val.whiteLists),
      blackListsEx: this.findLists(val.blackLists),
      ignoreListsEx: this.findLists(val.ignoreLists),

    }
    this.prepareWhiteAutoCompletes();
    this.prepareBlackAutoCompletes();
    this.prepareIgnoreAutoCompletes();

    this.formGroup = this.createFormGroup(this._model);

  }




  @Output()
  itemChanged: EventEmitter<boolean> = new EventEmitter();


  formGroup: FormGroup = this.createFormGroup(this._model);
  formError: { name: string, } = { name: '' }


  isThemeDark = false;


  private _intelligenceList: FqdnIntelligenceList[] = [];

  @Input()
  set intelligenceList(val: FqdnIntelligenceList[]) {
    this._intelligenceList = val;

  }
  get intelligenceList() {
    return this._intelligenceList;
  }




  private _intelligenceCategoryList: FqdnIntelligenceCategory[] = [];
  @Input()
  set intelligenceCategoryList(val: FqdnIntelligenceCategory[]) {
    this._intelligenceCategoryList = val;

  }
  get intelligenceCategoryList() {
    return this._intelligenceCategoryList;
  }



  ignoreListControl = new FormControl();
  allowListControl = new FormControl();
  denyListControl = new FormControl();

  filteredIgnoreCategoryList: FqdnIntelligenceCategory[] = [];
  filteredAllowCategoryList: FqdnIntelligenceCategory[] = [];
  filteredDenyCategoryList: FqdnIntelligenceCategory[] = [];

  filteredIgnoreLists: FqdnIntelligenceList[] = [];
  filteredAllowLists: FqdnIntelligenceList[] = [];
  filteredDenyLists: FqdnIntelligenceList[] = [];



  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;
  /** list of country filtered by search keyword */

  protected _onDestroy = new Subject<void>();



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



  ngOnInit(): void {
    this.prepareWhiteAutoCompletes();


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







  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;


  modelChanged() {

    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }



  createFormGroup(rule: FqdnIntelligenceProfile) {
    const fmg = new FormGroup({
      //name: new FormControl(rule.name, [Validators.required]),


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
    return { name: '' };
  }




  checkIfModelChanged() {

    this.model.isChanged = false;
    const original = this._model.orig as FqdnIntelligenceProfile;

    if (UtilService.checkChanged(original.ignoreFqdns.map(x => x.fqdn), this.model.ignoreFqdns.map(x => x.fqdn)))
      this.model.isChanged = true;
    if (UtilService.checkChanged(original.ignoreLists, this.model.ignoreLists))
      this.model.isChanged = true;

    if (UtilService.checkChanged(original.whiteFqdns.map(x => x.fqdn), this.model.whiteFqdns.map(x => x.fqdn)))
      this.model.isChanged = true;
    if (UtilService.checkChanged(original.whiteLists, this.model.whiteLists))
      this.model.isChanged = true;

    if (UtilService.checkChanged(original.blackFqdns.map(x => x.fqdn), this.model.blackFqdns.map(x => x.fqdn)))
      this.model.isChanged = true;
    if (UtilService.checkChanged(original.blackLists, this.model.blackLists))
      this.model.isChanged = true;
    this.itemChanged.emit(this.model.isChanged);

  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();


    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }


  createBaseModel(): FqdnIntelligenceProfile {
    return {
      blackFqdns: Array.from(this.model.blackFqdns),
      blackLists: Array.from(this.model.blackLists),
      ignoreFqdns: Array.from(this.model.ignoreFqdns),
      ignoreLists: Array.from(this.model.ignoreLists),
      whiteFqdns: Array.from(this.model.whiteFqdns),
      whiteLists: Array.from(this.model.whiteLists),
    }
  }


  displayNameFn(net: FqdnIntelligenceList | string) {
    if (typeof (net) == 'string') return net;
    return net?.name || '';
  }
  findLists(ids: string[]) {

    let lists = this.intelligenceList.filter(x => ids.includes(x.id)).map(x => { return { id: x.id, name: x.name } });
    lists = lists.concat(this.intelligenceCategoryList.filter(x => ids.includes(x.id)).map(x => { return { id: x.id, name: x.name } }))
    lists.sort(this.simpleNameSort);

    return lists;
  }

  // allow immediately
  prepareWhiteAutoCompletes() {

    this.filteredAllowCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).sort(this.simpleNameSort);
    this.filteredAllowLists = this.intelligenceList.sort(this.simpleNameSort);
    this.allSub.addThis =
      this.allowListControl.valueChanges.subscribe(x => {
        const value = x;
        const val = typeof (x) === 'string' ? value.toLowerCase() : ''
        if (val) {

          this.filteredAllowLists = this.intelligenceList.filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
          this.filteredAllowCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
        } else {
          this.filteredAllowLists = this.intelligenceList.sort(this.simpleNameSort);
          this.filteredAllowCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).sort(this.simpleNameSort);
        }
        this.filteredAllowLists = this.filteredAllowLists.filter(x => !this.model.whiteLists.includes(x.id))
        this.filteredAllowCategoryList = this.filteredAllowCategoryList.filter(x => !this.model.whiteLists.includes(x.id))

      })
    this.filteredAllowLists = this.filteredAllowLists.filter(x => !this.model.whiteLists.includes(x.id))
    this.filteredAllowCategoryList = this.filteredAllowCategoryList.filter(x => !this.model.whiteLists.includes(x.id))



  }

  removeWhiteFqdn(label: FqdnProfile): void {
    this.model.whiteFqdns = this.model.whiteFqdns?.filter(x => x.fqdn != label.fqdn);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }
  addWhiteFqdn(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    if (!UtilService.isFqdn(value))
      return;
    // Add our fruit
    if (value) {
      const isExits = this.model.whiteFqdns?.find(x => x.fqdn == value);
      if (!isExits) {
        if (!this.model.whiteFqdns)
          this.model.whiteFqdns = [];

        this.model.whiteFqdns.push({ fqdn: value });
      }
    }

    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }



  removeWhiteList(ug: { id: string }): void {
    if (this.model.whiteLists && this.model.whiteListsEx) {
      this.model.whiteLists = this.model.whiteLists.filter(x => x != ug.id);
      this.model.whiteListsEx = this.model.whiteListsEx.filter(x => x.id != ug.id);
      if (this.formGroup.valid)
        this.checkIfModelChanged();
      this.prepareWhiteAutoCompletes();
    }

  }


  whiteListSelected(event: any) {

    const value = event.option.value;
    if (value.id) {
      if (!this.model.whiteLists.includes(value.id)) {

        this.model.whiteLists.push(value.id);
        //

        const items = this.findLists([value.id])
        if (!this.model.whiteListsEx)
          this.model.whiteListsEx = [];
        if (this.model.whiteListsEx)
          this.model.whiteListsEx = this.model.whiteListsEx.concat(items);

        this.modelChanged();
        this.prepareWhiteAutoCompletes();
      }
    }
  }

  //deny list
  prepareBlackAutoCompletes() {

    this.filteredDenyCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).sort(this.simpleNameSort);
    this.filteredDenyLists = this.intelligenceList.sort(this.simpleNameSort);
    this.allSub.addThis =
      this.denyListControl.valueChanges.subscribe(x => {
        const value = x;
        const val = typeof (x) === 'string' ? value.toLowerCase() : ''
        if (val) {

          this.filteredDenyLists = this.intelligenceList.filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
          this.filteredDenyCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
        } else {
          this.filteredDenyLists = this.intelligenceList.sort(this.simpleNameSort);
          this.filteredDenyCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).sort(this.simpleNameSort);
        }
        this.filteredDenyLists = this.filteredDenyLists.filter(x => !this.model.blackLists.includes(x.id))
        this.filteredDenyCategoryList = this.filteredDenyCategoryList.filter(x => !this.model.blackLists.includes(x.id))

      })
    this.filteredDenyLists = this.filteredDenyLists.filter(x => !this.model.blackLists.includes(x.id))
    this.filteredDenyCategoryList = this.filteredDenyCategoryList.filter(x => !this.model.blackLists.includes(x.id))



  }

  removeBlackFqdn(label: FqdnProfile): void {
    this.model.blackFqdns = this.model.blackFqdns?.filter(x => x.fqdn != label.fqdn);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }
  addBlackFqdn(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    if (!UtilService.isFqdn(value))
      return;
    // Add our fruit
    if (value) {
      const isExits = this.model.blackFqdns?.find(x => x.fqdn == value);
      if (!isExits) {
        if (!this.model.blackFqdns)
          this.model.blackFqdns = [];

        this.model.blackFqdns.push({ fqdn: value });
      }
    }

    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }



  removeBlackList(ug: { id: string }): void {
    if (this.model.blackLists && this.model.blackListsEx) {
      this.model.blackLists = this.model.blackLists.filter(x => x != ug.id);
      this.model.blackListsEx = this.model.blackListsEx.filter(x => x.id != ug.id);
      if (this.formGroup.valid)
        this.checkIfModelChanged();
      this.prepareBlackAutoCompletes();
    }

  }


  blackListSelected(event: any) {

    const value = event.option.value;
    if (value.id) {
      if (!this.model.blackLists.includes(value.id)) {

        this.model.blackLists.push(value.id);
        //

        const items = this.findLists([value.id])
        if (!this.model.blackListsEx)
          this.model.blackListsEx = [];
        if (this.model.blackListsEx)
          this.model.blackListsEx = this.model.blackListsEx.concat(items);

        this.modelChanged();
        this.prepareBlackAutoCompletes();
      }
    }
  }

  //ignore list
  prepareIgnoreAutoCompletes() {

    this.filteredIgnoreCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).sort(this.simpleNameSort);
    this.filteredIgnoreLists = this.intelligenceList.sort(this.simpleNameSort);
    this.allSub.addThis =
      this.ignoreListControl.valueChanges.subscribe(x => {
        const value = x;
        const val = typeof (x) === 'string' ? value.toLowerCase() : ''
        if (val) {

          this.filteredIgnoreLists = this.intelligenceList.filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
          this.filteredIgnoreCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).filter(x => x.name.toLowerCase().includes(val)).sort(this.simpleNameSort);
        } else {
          this.filteredIgnoreLists = this.intelligenceList.sort(this.simpleNameSort);
          this.filteredIgnoreCategoryList = this.intelligenceCategoryList.filter(x => x.isVisible).sort(this.simpleNameSort);
        }
        this.filteredIgnoreLists = this.filteredIgnoreLists.filter(x => !this.model.ignoreLists.includes(x.id))
        this.filteredIgnoreCategoryList = this.filteredIgnoreCategoryList.filter(x => !this.model.ignoreLists.includes(x.id))

      })
    this.filteredIgnoreLists = this.filteredIgnoreLists.filter(x => !this.model.ignoreLists.includes(x.id))
    this.filteredIgnoreCategoryList = this.filteredIgnoreCategoryList.filter(x => !this.model.ignoreLists.includes(x.id))



  }

  removeIgnoreFqdn(label: FqdnProfile): void {
    this.model.ignoreFqdns = this.model.ignoreFqdns?.filter(x => x.fqdn != label.fqdn);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }
  addIgnoreFqdn(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    if (!UtilService.isFqdn(value))
      return;
    // Add our fruit
    if (value) {
      const isExits = this.model.ignoreFqdns?.find(x => x.fqdn == value);
      if (!isExits) {
        if (!this.model.ignoreFqdns)
          this.model.ignoreFqdns = [];

        this.model.ignoreFqdns.push({ fqdn: value });
      }
    }

    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }



  removeIgnoreList(ug: { id: string }): void {
    if (this.model.ignoreLists && this.model.ignoreListsEx) {
      this.model.ignoreLists = this.model.ignoreLists.filter(x => x != ug.id);
      this.model.ignoreListsEx = this.model.ignoreListsEx.filter(x => x.id != ug.id);
      if (this.formGroup.valid)
        this.checkIfModelChanged();
      this.prepareIgnoreAutoCompletes();
    }

  }


  ignoreListSelected(event: any) {

    const value = event.option.value;
    if (value.id) {
      if (!this.model.ignoreLists.includes(value.id)) {

        this.model.ignoreLists.push(value.id);
        //

        const items = this.findLists([value.id])
        if (!this.model.ignoreListsEx)
          this.model.ignoreListsEx = [];
        if (this.model.ignoreListsEx)
          this.model.ignoreListsEx = this.model.ignoreListsEx.concat(items);

        this.modelChanged();
        this.prepareIgnoreAutoCompletes();
      }
    }
  }


}


