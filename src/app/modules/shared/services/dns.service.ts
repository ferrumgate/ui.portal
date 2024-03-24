import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Group } from '../models/group';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';
import { DnsRecord } from '../models/dns';



@Injectable({
  providedIn: 'root'
})
export class DnsService extends BaseService {

  private _dnsUrl = this.configService.getApiUrl() + '/dns';
  private _dnsRecordUrl = this.configService.getApiUrl() + '/dns/record';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('dns', captchaService)

  }



  saveOrupdateRecord(item: DnsRecord) {
    const record: DnsRecord = {
      id: item.id,
      labels: item.labels,
      fqdn: item.fqdn,
      isEnabled: item.isEnabled,
      ip: item.ip,

    }

    return this.preExecute(record).pipe(
      switchMap(y => {
        if (record.id)
          return this.httpService.put<DnsRecord>(this._dnsRecordUrl, y, this.jsonHeader)
        else return this.httpService.post<DnsRecord>(this._dnsRecordUrl, y, this.jsonHeader)
      }))

  }

  deleteRecord(record: DnsRecord) {


    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._dnsRecordUrl, `${record.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  getRecord(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._dnsRecordUrl, `${id}`, urlParams);
        return this.httpService.get<Group>(url);
      }))
  }

  getRecord2(page: number, pageSize: number, search?: string, ids?: string[]) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids.join(','));
    searchParams.append("page", page.toString());
    searchParams.append("pageSize", pageSize.toString());
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._dnsRecordUrl, y);
        return this.httpService.get<{ items: DnsRecord[], total: number }>(url);
      })
    )
  }


}
