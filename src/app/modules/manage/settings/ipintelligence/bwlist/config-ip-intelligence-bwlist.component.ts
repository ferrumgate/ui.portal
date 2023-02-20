import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceBWItem } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import validator from 'validator';


export interface BWComponentData {
  searchData: { total: number, items: IpIntelligenceBWItem[] },
  saveResults: { item: IpIntelligenceBWItem; errMsg?: string | undefined; }[];
  showViewSaveResults: boolean,
  showViewSave: boolean,
  showViewSearch: boolean

}

export interface SaveModel {
  ips: string;
  description?: string;
  isChanged: boolean;
}


@Component({
  selector: 'app-config-ip-intelligence-bwlist',
  templateUrl: './config-ip-intelligence-bwlist.component.html',
  styleUrls: ['./config-ip-intelligence-bwlist.component.scss']
})
export class ConfigIpIntelligenceBWListComponent implements OnInit, OnDestroy {
  allSubs = new SSubscription();
  searchForm = new FormControl();


  @Input()
  set isBlackList(val: any) {
    this._isBlackList = val == 'true' ? true : false;

  }
  get isBlackList() {
    return this._isBlackList;
  }
  _isBlackList = false;
  searchIp = '';

  @Input()
  tooltip = ''
  @Input()
  helpLink = ''

  @Input()
  title = 'Black List';

  page = 0;
  pageSize = 10;

  @Output()
  search = new EventEmitter();
  @Output()
  deleteItem = new EventEmitter();
  @Output()
  saveItems = new EventEmitter();

  @Input()
  model: BWComponentData = {
    saveResults: [], searchData: { total: 0, items: [] }, showViewSaveResults: false, showViewSave: false, showViewSearch: true
  }



  isThemeDark = false;


  private _saveModel: SaveModel = { ips: '', isChanged: false };
  public get saveModel() {
    return this._saveModel;

  }
  public set saveModel(val: SaveModel) {
    this._saveModel = {
      ...val,
      isChanged: false,
    }

    this.saveFormGroup = this.createSaveFormGroup(this._saveModel);
  }


  //ip intelligence save settings
  saveFormGroup: FormGroup = this.createSaveFormGroup(this.saveModel);
  saveError: { ips: string } = { ips: '' };

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {


    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.allSubs.addThis =
      this.searchForm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(newMessage => {
        this.searchIp = newMessage;
        this.searchList(false);
      });



  }

  ngOnInit(): void {


  }
  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }
  ngAfterViewInit(): void {

  }
  searchList(check = true) {

    if (this.searchIp) {
      if (!validator.isIP(this.searchIp)) {
        if (check)
          this.notificationService.error(this.searchIp + ' ' + this.translateService.translate('IpInvalid'));
        return;
      }
    }
    this.model.showViewSaveResults = false;
    this.model.showViewSave = false;
    this.model.showViewSearch = true;
    this.search.emit({ ip: this.searchIp, page: this.page, pageSize: this.pageSize })
  }
  addNew() {
    this.model.showViewSaveResults = false;
    this.model.showViewSave = true;
    this.model.showViewSearch = false;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  pageChanged($event: any) {
    this.pageSize = $event.pageSize;
    this.page = $event.pageIndex;
    this.searchList();
  }

  delete(ev: IpIntelligenceBWItem) {
    this.deleteItem.emit(ev);
  }

  ///save functions

  createSaveFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        ips: new FormControl(model.ips, [Validators.required]),
        description: new FormControl(model.description, []),

      });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSubs.addThis =
        fm.valueChanges.subscribe(x => {
          (this._saveModel as any)[iterator] = x;
        })
    }
    this.allSubs.addThis =
      fmg.valueChanges.subscribe(x => {
        this.saveModelChanged();
      })
    return fmg;
  }
  resetSaveErrors() {

    return {
      ips: ''
    }
  }

  saveModelChanged() {
    this.checkSaveFormError();
    if (this.saveFormGroup.valid)
      this.checkIfModelChanged();
    else this._saveModel.isChanged = false;

  }

  checkSaveFormError() {
    //check errors 
    this.saveError = this.resetSaveErrors();
    const ipsError = this.saveFormGroup.controls.ips.errors;

    if (ipsError) {
      if (ipsError['required'])
        this.saveError.ips = 'EnterAtLeastOneNetwork';
      else
        this.saveError.ips = 'EnterAtLeastOneNetwork';
    }


  }
  splitIps(str: String) {
    return str.split(/[!\s,_+;:]+/).map(x => x.trim()).filter(y => y);
  }
  checkIfModelChanged() {

    let model = this.saveModel as SaveModel;
    model.isChanged = false;
    if (this.splitIps(this.saveModel.ips))
      this._saveModel.isChanged = true;
    else this._saveModel.isChanged = false;


  }

  clear() {

    this.saveModel.isChanged = false;
    this.saveModel.ips = '';
    this.saveFormGroup = this.createSaveFormGroup(this.saveModel);
  }
  saveOrUpdate() {
    const ips = this.splitIps(this.saveModel.ips);
    if (!ips.length) {
      this.notificationService.error(this.translateService.translate("EnterAtLeastOneNetwork"));
      return;
    }
    for (const ip of ips) {
      const isValid = validator.isIP(ip) || validator.isIPRange(ip);
      if (!isValid) {
        this.notificationService.error(ip + ` ` + this.translateService.translate(`IpOrCIDRIsInvalid`))
        return;
      }
    }
    this.saveItems.emit({ ips: ips, description: this.saveModel.description });

  }

  resetToAdd() {

  }




}
