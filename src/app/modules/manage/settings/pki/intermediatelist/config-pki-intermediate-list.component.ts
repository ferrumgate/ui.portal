import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, of, switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceList, IpIntelligenceListStatus } from 'src/app/modules/shared/models/ipIntelligence';
import { SSLCertificate, SSLCertificateEx } from 'src/app/modules/shared/models/sslCertificate';
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
  selector: 'app-config-pki-intermediate-list',
  templateUrl: './config-pki-intermediate-list.component.html',
  styleUrls: ['./config-pki-intermediate-list.component.scss']
})
export class ConfigPKIIntermediateListComponent implements OnInit, OnDestroy {
  allSubs = new SSubscription();

  networkFormControl = new FormControl();

  certs: SSLCertificateEx[] = [];

  helpLink = ''
  isThemeDark = false;
  searchKey = '';
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private pkiService: PKIService) {


    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.helpLink = this.configService.links.pkiHelp;
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //search input with wait


  }
  ngOnInit(): void {

    // real data
    this.getAllData().subscribe();
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }


  getAllData() {

    //test data

    /*    let testData: { items: SSLCertificateEx[] } = {
         items:
           [
             {
               id: '1', insertDate: new Date().toString(), name: 'web intermediate', updateDate: new Date().toString(), labels: ['test'],
               isEnabled: true, isSystem: true,
               privateKey: `
               -----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDf7j6va/zwdvRx
   cDRBpJBtng5pS+7JB0SxSH6LP5XitGbv88MguQ3tiU85uTNDlYk5b1Fgtzxp/p2+
   PAvkcJH5RMn68X7c/uoJCOhrAMmN7JPd6zSQuKlJRoiNHi5RX8QGVURl9dTv7aRf
   KBK0JzrW0Q/WCuaLBSQt5vPjmUJy6x4/uHm0uhceXoFJ3P2QLr9b3fEzMPi+M27U
   /cAWl0Q/6Yxrzse1Slfb4OuAik964B5etAGThF9T+ShUaD7JQjEn4KugYANgf7r9
   xwbJTrdHWhNpCcaz4lJaUqX2bh789Upj6+djJnQDiknGQ3UPs+Rw047ByN31ayhE
   Bs27m66TAgMBAAECggEBAKzSPzi9m+mttLvzv7DFo92ltTOYscIeROqZq2gme7QK
   TMN1mqufhltDtIw1HZZUSyKzgdelsw+OvQk7aGY2ZsI9T7DHPoSqi87LPCyQ3/0T
   j48e3mOu0J/Hus1GdLLCuRO2LOKP1nYRLuFtmPnGqQdvM8yafxDdt+1hJ+sIthrf
   XrWSHwyzUiuN4wNetjQBSmGPYhUnPeH1yjLdbsH6vSA4MObA5qwTkZwESchF/mOV
   zISHnlhriQl6jp72rjWjIn0ua0fOH56XxlJ4aNwOZFsQIo+kMP+RbIMWxYaIja/+
   e+VljsbASjVE+lpmpeYL85QrkMQD68UJWZZwsC2XKPkCgYEA9frbl/GQhfDy/QZx
   nlMhsKaSlF/NAnw/zvwSQcarAPbo6DGrOVstH51cWKXtvkTOYNr0Ui5gB1l7A1Nf
   wV0X3gLEOVbxy1wSzcPlZ+BnpSMUb7+9GgxK4/Tg85pEHqkLYCiI8pBdlFpCxWrz
   hcpUk5FvdL7UG7poEhGrKGldS+0CgYEA6Q1zm16UoFJc3wXb8IHAdiS7cFHKvk7Z
   iDpDLHuN+9qfQ8w8pKmoX8K06TLK0JooRehEa7LlSBC+ouIZ+zD9quHuiECLtuXK
   vriHXUgM5xUHmo/kgLPop+/FPKVPlLrhuzPAbeADydgFNazsDTsbzIL5cXrCwNa+
   zi8wK55mlH8CgYAZzNgflczM37r84yIjsyCDgNU7DtlX+2RN946Kq6XgEgXX5O3K
   tE+FU2IOQkkvfdQPwKeDvy1/V9lZPfN7OqJ4PN4MDZyK8fte7b8wKA92+Lj6B6h0
   BPoN8u9tXa7rcFurGFVU6+OE3frG7jLgw5ofaE/CdQmWZvTngEbtlC+e+QKBgCqo
   h6y81z+xU8aO7/9KAMyfVJ/umMnU7QR+haUyyH59OgHS9Ja/Z05/+VVmMrGURiLl
   rQB5snZKelqeQFs2UHhi+qJ+DhTgYwgeBskQUyxJMScdh5n3VHLI9LVxHOwAeSkn
   A+YYxxi/LdTxXhPd6ey5XKdk7RkXNb3P7WVOjUBJAoGAZoSUaocSY0P3kl7viCXZ
   2gG9+mRQzjyW6LHnWhJ0JEyvrAOPljYMdbpSXB2hu5kB8WW5fbv+/GOjNMI5L2PK
   cmJ9YxtNZnIRhLboGJNdBV6PWmAVrF+N7vmIQfUQDupCRcBgPvxjbquf/okWrv34
   qrnWVbgmNz/AsuOY8t/nCzU=
   -----END PRIVATE KEY-----`,
               publicCrt: `
               -----BEGIN CERTIFICATE-----
   MIIDLTCCAhWgAwIBAgIUP2/k65GbNCmtp9jEnLnErbkgFlswDQYJKoZIhvcNAQEL
   BQAwJjERMA8GA1UEAwwIdGVzdC5jb20xETAPBgNVBAoMCHRlc3QuY29tMB4XDTIz
   MDQwNTE1MDM1NloXDTMzMDQwMjE1MDM1NlowJjERMA8GA1UEAwwIdGVzdC5jb20x
   ETAPBgNVBAoMCHRlc3QuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
   AQEA3+4+r2v88Hb0cXA0QaSQbZ4OaUvuyQdEsUh+iz+V4rRm7/PDILkN7YlPObkz
   Q5WJOW9RYLc8af6dvjwL5HCR+UTJ+vF+3P7qCQjoawDJjeyT3es0kLipSUaIjR4u
   UV/EBlVEZfXU7+2kXygStCc61tEP1grmiwUkLebz45lCcuseP7h5tLoXHl6BSdz9
   kC6/W93xMzD4vjNu1P3AFpdEP+mMa87HtUpX2+DrgIpPeuAeXrQBk4RfU/koVGg+
   yUIxJ+CroGADYH+6/ccGyU63R1oTaQnGs+JSWlKl9m4e/PVKY+vnYyZ0A4pJxkN1
   D7PkcNOOwcjd9WsoRAbNu5uukwIDAQABo1MwUTAdBgNVHQ4EFgQUXQRJp7htavb2
   et+zqLUbOGUcoO8wHwYDVR0jBBgwFoAUXQRJp7htavb2et+zqLUbOGUcoO8wDwYD
   VR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAFaXDCG4Hky62c0ACjj0K
   MhWwnVABNAH9fE0rTF8q1hdUxCl7n99KJ4Ywf5TP7j04PROGcTyqaizvYsH9StPp
   jTCB9cqiTP60syKFEoviTNsOBrGvd5fkUQvro5mI2XTFiK54atk7RLYkZ9h8EZog
   loSD48iRvFqBW/A6f2IFedwNbgj9qPay/Ii5JIxi11kv0MiismZHWS6SPMqdNJIT
   SMfOQ7I2kpanAU32lLPLGkC5cUBz7wDXrj6rPH7pQeiR82PLKvmOoZpgHdCisCHc
   LFCQsnzaQu6gucSZAyG6s85HvyyAdpS+SfWR/TlXBtKGBg1/P98bNkBjnsMaTT3Z
   bA==
   -----END CERTIFICATE-----`
             },
   
   
             {
               id: '2', insertDate: new Date().toString(), name: 'file list', updateDate: new Date().toString(), labels: ['test'],
               isEnabled: true,
             }
           ]
   
       } */
    let testData = { items: [] };

    return (testData.items.length ? of(testData) : this.pkiService.getIntermediateList()).pipe(
      map(z => {

        this.certs = z.items.map(x => {

          return this.prepareCert(x)
        }).sort((a, b) => {

          return a.name.localeCompare(b.name)
        })
      })
    )

  }
  prepareCert(cert: SSLCertificateEx,) {

    cert.objId = UtilService.randomNumberString();
    cert.insertDateStr = UtilService.dateFormatToLocale(new Date(cert.insertDate));

    return cert;
  }


  addNewCert(type: 'auth' | 'tls') {
    const cert: SSLCertificateEx = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', labels: [],
      insertDate: new Date().toISOString(), updateDate: '',
      isExpanded: true, category: type, isEnabled: true, isIntermediate: true,
      isNew: true
    }

    this.certs.unshift(cert);
  }
  saveCert($event: SSLCertificate) {

    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.saveList2($event)),
    ).subscribe();


  }
  saveList2($event: SSLCertificate) {
    return this.pkiService.saveOrupdateIntermediateCert($event as SSLCertificateEx).pipe(
      map(
        (item) => {
          //find saved item and replace it
          const index = this.certs.findIndex(x => x.objId == $event.objId);
          const oldObj = this.certs[index];
          this.certs[index] = {
            ...item,
            objId: oldObj.objId,
            isExpanded: true
          }
          this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

        }));

  }

  deleteCert($event: SSLCertificate) {
    if (!$event.id) {//list we created temporarily
      const index = this.certs.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.certs.splice(index, 1);

    } else {
      //real  execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.pkiService.deleteIntermediateCert($event as SSLCertificateEx)
        ),
      ).subscribe((x) => {
        //delete from group list
        const index = this.certs.findIndex(x => x.objId == $event.objId);
        this.certs.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }




}
