import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivityLog } from '../models/activityLog';
import { AuditLog } from '../models/auditLog';

import { Configure } from '../models/configure';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';



@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {

  private _activityUrl = this.configService.getApiUrl() + '/insight/activity';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('activity', captchaService)

  }



  get(startDate?: string, endDate?: string, page?: number, pageSize?: number, search?: string, types?: string[],
    usernames?: string[],
    requestIds?: string[], sessionIds?: string[],
    statuses?: number[], statusMessages?: string[], authSources?: string[]) {

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
    if (usernames && usernames.length)
      searchParams.append('username', usernames.join(','));
    if (types && types.length)
      searchParams.append('type', types.join(','));
    if (requestIds && requestIds.length)
      searchParams.append('requestId', requestIds.join(','));
    if (sessionIds && sessionIds.length)
      searchParams.append('sessionId', sessionIds.join(','));
    if (statuses && statuses.length)
      searchParams.append('status', statuses.join(','));
    if (statusMessages && statusMessages.length)
      searchParams.append('statusMessage', statusMessages.join(','));
    if (authSources && authSources.length)
      searchParams.append('authSource', authSources.join(','));

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._activityUrl, y);
        return this.httpService.get<{ items: ActivityLog[], total: number }>(url);
      })
    )

  }



}
