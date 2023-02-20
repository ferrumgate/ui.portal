import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Configure } from '../models/configure';
import { IpIntelligenceBWItem } from '../models/ipIntelligence';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';

type BW = 'blacklist' | 'whitelist';

@Injectable({
  providedIn: 'root'
})
export class IpIntelligenceService extends BaseService {

  private _ipIntelligenceUrl = this.configService.getApiUrl() + '/ip/intelligence';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('ipIntelligence', captchaService)

  }


  deleteBWList(type: 'blacklist' | 'whitelist', item: IpIntelligenceBWItem) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._ipIntelligenceUrl, type, `${item.id}`, y);
        return this.httpService.delete(url);

      }))
  }


  saveOrupdateBWList(type: 'blacklist' | 'whitelist', ips: IpIntelligenceBWItem[]) {
    const iplist: IpIntelligenceBWItem[] = ips.map(x => {
      return { id: x.id, val: x.val, description: x.description, insertDate: x.insertDate }
    })

    return this.preExecute({ items: iplist }).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._ipIntelligenceUrl, type);
        return this.httpService.post<{ results: { item: IpIntelligenceBWItem, errMsg?: string }[] }>(url, y, this.jsonHeader)
      }))

  }




  get(type: 'blacklist' | 'whitelist', page: number, pageSize: number, ip?: string, ids?: string[]) {

    const searchParams = new URLSearchParams();
    if (ip)
      searchParams.append('ip', ip);
    if (ids)
      searchParams.append('ids', ids.join(','));
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._ipIntelligenceUrl, type, y);
        return this.httpService.get<{ items: IpIntelligenceBWItem[], total: number }>(url);
      })
    )

  }






}
