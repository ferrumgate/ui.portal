import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceList, IpIntelligenceSource } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import validator from 'validator';




@Component({
  selector: 'app-config-ip-intelligence',
  templateUrl: './config-ip-intelligence.component.html',
  styleUrls: ['./config-ip-intelligence.component.scss']
})
export class ConfigIpIntelligenceComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';


  isThemeDark = false;


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


    this.searchSources();

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();

  }
  ngAfterViewInit(): void {

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
