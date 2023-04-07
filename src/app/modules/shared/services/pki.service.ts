import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Configure } from '../models/configure';
import { IpIntelligenceList, IpIntelligenceListStatus, IpIntelligenceSource } from '../models/ipIntelligence';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { saveAs } from 'file-saver';
import { SSLCertificate, SSLCertificateEx } from '../models/sslCertificate';


@Injectable({
  providedIn: 'root'
})
export class PKIService extends BaseService {


  private _pkiUrl = this.configService.getApiUrl() + '/pki';
  private _pkiIntermediateUrl = this.configService.getApiUrl() + '/pki/intermediate';
  private _pkiWebUrl = this.configService.getApiUrl() + '/pki/cert/web';

  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('pki', captchaService)

  }



  getIntermediateList() {
    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._pkiIntermediateUrl, y);
        return this.httpService.get<{ items: SSLCertificateEx[] }>(url);
      })
    )
  }



  saveOrupdateIntermediateCert(item: SSLCertificateEx) {
    const cert: SSLCertificateEx = {
      id: item.id, insertDate: item.insertDate, isEnabled: item.isEnabled, labels: item.labels, name: item.name,
      updateDate: item.updateDate, category: item.category, idEx: item.idEx, isIntermediate: item.isIntermediate, parentId: item.parentId,
    }
    return this.preExecute(cert).pipe(
      switchMap(y => {
        if (cert.id || cert.idEx)
          return this.httpService.put<SSLCertificateEx>(this._pkiIntermediateUrl, y, this.jsonHeader)
        else return this.httpService.post<SSLCertificateEx>(this._pkiIntermediateUrl, y, this.jsonHeader)
      }))

  }


  deleteIntermediateCert(item: SSLCertificateEx) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._pkiIntermediateUrl, `${item.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  getWebCert() {
    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._pkiWebUrl, y);
        return this.httpService.get<{ items: SSLCertificate[] }>(url);
      })
    )
  }
  saveOrupdateWebCert(item: SSLCertificate) {
    const cert: SSLCertificate = {
      id: item.id, insertDate: item.insertDate, isEnabled: item.isEnabled, labels: item.labels, name: item.name,
      updateDate: item.updateDate, category: item.category, idEx: item.idEx, isIntermediate: item.isIntermediate, parentId: item.parentId,
      privateKey: item.privateKey, publicCrt: item.publicCrt
    }
    return this.preExecute(cert).pipe(
      switchMap(y => {
        return this.httpService.put<SSLCertificate>(this._pkiWebUrl, y, this.jsonHeader)

      }))

  }
  deleteWebCert(item: SSLCertificate) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._pkiWebUrl, y);
        return this.httpService.delete<SSLCertificate>(url);

      }))
  }






}
