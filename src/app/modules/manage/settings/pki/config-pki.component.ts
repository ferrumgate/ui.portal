import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { SSLCertificate } from 'src/app/modules/shared/models/sslCertificate';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { PKIService } from 'src/app/modules/shared/services/pki.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

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

  enableLetsEncrypt(ev: SSLCertificate) {
    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(y => this.pkiService.refreshWebCertLetsEncryt(ev))
    ).subscribe(y => {
      this.webCert = y;
      this.notificationService.success(this.translateService.translate('SuccessfullyActivated'))
    })
  }

  disableLetsEncrypt(ev: SSLCertificate) {
    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(y => this.pkiService.deleteWebCertLetsEncryt(ev))
    ).subscribe(y => {
      this.webCert = y;
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    })
  }

}
