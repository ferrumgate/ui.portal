import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceList, IpIntelligenceSource } from 'src/app/modules/shared/models/ipIntelligence';
import { SSLCertificate } from 'src/app/modules/shared/models/sslCertificate';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { PKIService } from 'src/app/modules/shared/services/pki.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import validator from 'validator';




@Component({
  selector: 'app-config-pki',
  templateUrl: './config-pki.component.html',
  styleUrls: ['./config-pki.component.scss']
})
export class ConfigPKIComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  webCert: SSLCertificate = this.defaultCert()
  isThemeDark = false;

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    private pkiService: PKIService
  ) {


    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.pkiHelp;

  }
  defaultCert(): SSLCertificate {
    return {
      insertDate: new Date().toISOString(), isEnabled: true, labels: [],
      name: '', category: 'web', updateDate: new Date().toISOString(),
      usages: []
    }
  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {
    //test data

    this.getWebCert();

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();

  }
  ngAfterViewInit(): void {

  }


  getWebCert() {
    this.pkiService.getWebCert().subscribe(y => {
      this.webCert = y.items[0] || this.defaultCert()
    })
  }


  saveWebCert(ev: SSLCertificate) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.pkiService.saveOrupdateWebCert(ev))
    ).subscribe(y => {
      this.webCert = y;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    })
  }

  deleteWebCert(ev: SSLCertificate) {
    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(y => this.pkiService.deleteWebCert(ev))
    ).subscribe(y => {
      this.webCert = y;
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    })
  }





}
