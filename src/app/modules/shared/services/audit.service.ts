import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditLog } from '../models/auditLog';

import { Configure } from '../models/configure';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class AuditService extends BaseService {

  private _auditUrl = this.configService.getApiUrl() + '/log/audit';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('audit', captchaService)

  }



  get(startDate?: string, endDate?: string, page?: number, pageSize?: number, search?: string, users?: string[], messages?: string[]) {

    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append('startDate', startDate);
    if (endDate)
      searchParams.append('endDate', endDate);
    if (page)
      searchParams.append('page', page.toString());
    if (pageSize)
      searchParams.append('pageSize', pageSize.toString());
    if (search)
      searchParams.append('search', search);
    if (users && users.length)
      searchParams.append('username', users.join(','));
    if (messages && messages.length)
      searchParams.append('message', messages.join(','));


    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._auditUrl, y);
        return this.httpService.get<{ items: AuditLog[], total: number }>(url);
      })
    )

  }



}
