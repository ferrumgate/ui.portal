import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceBWItem, IpIntelligenceSource } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import validator from 'validator';
import { BWComponentData } from './bwlist/config-ip-intelligence-bwlist.component';



@Component({
  selector: 'app-config-ip-intelligence',
  templateUrl: './config-ip-intelligence.component.html',
  styleUrls: ['./config-ip-intelligence.component.scss']
})
export class ConfigIpIntelligenceComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';


  isThemeDark = false;

  blackList: BWComponentData = {
    searchData: { total: 0, items: [] },
    saveResults: [],
    showViewSave: false,
    showViewSearch: true,
    showViewSaveResults: false
  }

  whiteList: BWComponentData = {
    searchData: { total: 0, items: [] },
    saveResults: [],
    showViewSave: false,
    showViewSearch: true,
    showViewSaveResults: false
  }

  sources: IpIntelligenceSource[] = [];






  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    private ipIntelligenceService: IpIntelligenceService) {


    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';



    this.helpLink = this.configService.links.ipIntelligenceHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {
    //test data
    /* this.blackList = {
      searchData: {
        total: 5,
        items: [
          { id: UtilService.randomNumberString(), val: '192.168.0.1/24', insertDate: new Date().toISOString(), description: 'test1' },
          { id: UtilService.randomNumberString(), val: '192.168.1.1/24', insertDate: new Date().toISOString(), description: 'test2' },
          { id: UtilService.randomNumberString(), val: '192.168.2.1/24', insertDate: new Date().toISOString(), description: 'test3' }
        ]
      },
      saveResults: [], showViewSave: false, showViewSaveResults: false, showViewSearch: true
    }

    this.whiteList = {
      searchData: {
        total: 5,
        items: [
          { id: UtilService.randomNumberString(), val: '172.168.0.1/24', insertDate: new Date().toISOString(), description: 'test1' },
          { id: UtilService.randomNumberString(), val: '172.168.1.1/24', insertDate: new Date().toISOString(), description: 'test2' },

        ]
      },
      saveResults: [], showViewSave: false, showViewSaveResults: false, showViewSearch: true
    } */
    this.searchBlackList({ ip: '', page: 0, pageSize: 10 })
    this.searchWhiteList({ ip: '', page: 0, pageSize: 10 })
    this.searchSources();

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();

  }
  ngAfterViewInit(): void {

  }

  deleteBlackList(ev: IpIntelligenceBWItem) {
    console.log(ev);
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y =>
        this.ipIntelligenceService.deleteBWList('blacklist', ev)
      ),
    ).subscribe(() => {
      let index = this.blackList.searchData.items.findIndex(x => x.id == ev.id)
      if (index >= 0)
        this.blackList.searchData.items.splice(index, 1);
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    })

  }
  deleteWhiteList(ev: IpIntelligenceBWItem) {
    console.log(ev);
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y =>
        this.ipIntelligenceService.deleteBWList('whitelist', ev)
      ),
    ).subscribe(() => {
      let index = this.whiteList.searchData.items.findIndex(x => x.id == ev.id)
      if (index >= 0)
        this.whiteList.searchData.items.splice(index, 1);
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    })
  }
  saveBlackList(item: { ips: string[], description?: string }) {
    console.log(item);
    this.blackList.showViewSave = true;
    this.blackList.showViewSearch = false;
    this.blackList.showViewSaveResults = false;
    const items = item.ips.map(x => {
      let ip = x;
      if (!validator.isIPRange(ip))
        if (validator.isIP(ip, '4'))
          ip += '/32';
        else if (validator.isIP(ip, '6'))
          ip += '/128'

      return {
        id: UtilService.randomNumberString(16),
        insertDate: new Date().toISOString(),
        val: ip,
        description: item.description
      } as IpIntelligenceBWItem;

    });
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y =>
        this.ipIntelligenceService.saveOrupdateBWList('blacklist', items)
      ),
    ).subscribe((x) => {
      this.blackList.saveResults = x.results;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
      this.blackList.showViewSave = false;
      this.blackList.showViewSaveResults = true;
    })

  }
  saveWhiteList(item: { ips: string[], description?: string }) {
    console.log(item);
    this.whiteList.showViewSave = true;
    this.whiteList.showViewSearch = false;
    this.whiteList.showViewSaveResults = false;
    const items = item.ips.map(x => {
      let ip = x;
      if (!validator.isIPRange(ip))
        if (validator.isIP(ip, '4'))
          ip += '/32';
        else if (validator.isIP(ip, '6'))
          ip += '/128'

      return {
        id: UtilService.randomNumberString(16),
        insertDate: new Date().toISOString(),
        val: ip,
        description: item.description
      } as IpIntelligenceBWItem;

    });
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y =>
        this.ipIntelligenceService.saveOrupdateBWList('whitelist', items)
      ),
    ).subscribe((x) => {
      this.whiteList.saveResults = x.results;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
      this.whiteList.showViewSave = false;
      this.whiteList.showViewSaveResults = true;
    })

  }
  searchBlackList(search: { ip: string, page: number, pageSize: number }) {
    console.log(search);

    this.blackList.showViewSaveResults = false;
    this.blackList.showViewSave = false;
    this.blackList.showViewSearch = true;
    this.ipIntelligenceService.getBWList('blacklist', search.page, search.pageSize, search.ip)
      .subscribe(x => {
        x.items.forEach(y => {
          y.insertDate = UtilService.dateFormatToLocale(y.insertDate ? new Date(y.insertDate) : new Date())
        })
        this.blackList.searchData = x;

      })


  }
  searchWhiteList(search: { ip: string, page: number, pageSize: number }) {
    console.log(search);
    this.whiteList.showViewSaveResults = false;
    this.whiteList.showViewSave = false;
    this.whiteList.showViewSearch = true;
    this.ipIntelligenceService.getBWList('whitelist', search.page, search.pageSize, search.ip)
      .subscribe(x => {
        x.items.forEach(y => {
          y.insertDate = UtilService.dateFormatToLocale(y.insertDate ? new Date(y.insertDate) : new Date())
        })
        this.whiteList.searchData = x;

      })

  }
  getSource() {
    if (!this.sources.length)
      this.sources.push(this.createEmptySource());
    return this.sources[0];
  }

  searchSources() {
    this.ipIntelligenceService.getSource().subscribe(y => {
      this.sources = y.items;
    })
  }

  checkSource(ev: IpIntelligenceSource) {
    this.confirmService.show(
      this.translateService.translate('Confirm'),
      this.translateService.translate("DoYouWantToCheck")
    ).pipe(
      takeWhile(x => x),
      switchMap(y => this.ipIntelligenceService.checkSource(ev))
    ).subscribe(y => {
      if (!y.isError) {
        this.notificationService.success(this.translateService.translate('SourceWorkedSuccessfully'))
      }
      else {
        this.notificationService.error(this.translateService.translate('SomethingWentWrong'));
        this.notificationService.error(this.translateService.translate(y.errorMessage));
      }
    })
  }
  saveSource(ev: IpIntelligenceSource) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.ipIntelligenceService.saveOrupdateSource(ev))
    ).subscribe(y => {
      const index = this.sources.findIndex(x => x.objId == ev.objId)
      if (index >= 0)
        this.sources.splice(index, 1);
      y.objId = y.objId;
      y.insertDate = UtilService.dateFormatToLocale(y.insertDate ? new Date(y.insertDate) : new Date())
      this.sources.push(y);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    })
  }
  createEmptySource(): IpIntelligenceSource {
    return {
      objId: UtilService.randomNumberString(),
      id: '', insertDate: '', name: '', type: '', updateDate: ''
    }
  }
  deleteSource(ev: IpIntelligenceSource) {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y => this.ipIntelligenceService.deleteSource(ev))
    ).subscribe(y => {
      const index = this.sources.findIndex(x => x.objId == ev.objId)
      if (index >= 0)
        this.sources.splice(index, 1);
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    })
  }



}
