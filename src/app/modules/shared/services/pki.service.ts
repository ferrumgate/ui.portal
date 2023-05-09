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
  private _pkiCAUrl = this.configService.getApiUrl() + '/pki/ca';
  private _pkiWebUrl = this.configService.getApiUrl() + '/pki/cert/web';
  private _pkiWebLetsEncryptUrl = this.configService.getApiUrl() + '/pki/cert/web/letsencrypt';

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

  getCAList() {
    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._pkiCAUrl, y);
        return this.httpService.get<{ items: SSLCertificateEx[] }>(url);
      })
    )
  }



  saveOrupdateIntermediateCert(item: SSLCertificateEx) {
    const cert: SSLCertificateEx = {
      id: item.id, insertDate: item.insertDate, isEnabled: item.isEnabled, labels: item.labels, name: item.name,
      updateDate: item.updateDate, category: item.category, idEx: item.idEx, isIntermediate: item.isIntermediate, parentId: item.parentId,
      usages: item.usages
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
  exportIntermediateCert(item: SSLCertificateEx) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._pkiIntermediateUrl, `${item.id}`, 'export', y);
        return this.httpService.post(url, { password: item.password }, { responseType: 'blob', ...this.jsonHeader });

      }),
      switchMap((data: any) => {
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `${item.name}.pfx`;
        link.click();
        return of({});
      })
    )

  }
  exportPem(item: SSLCertificate) {
    const str = item.publicCrt || '';
    const blob = new Blob([str], { type: 'plain/text' });
    var downloadURL = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = `${item.name}.pem`;
    link.click();
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
      privateKey: item.privateKey, publicCrt: item.publicCrt,
      usages: item.usages
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

  deleteWebCertLetsEncryt(item: SSLCertificate) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._pkiWebLetsEncryptUrl, y);
        return this.httpService.delete<SSLCertificate>(url);

      }))


  }
  refreshWebCertLetsEncryt(item: SSLCertificate) {

    return this.preExecute({}).pipe(
      switchMap(y => {
        return this.httpService.post<SSLCertificate>(this._pkiWebLetsEncryptUrl, y, this.jsonHeader)

      }))


  }


}
