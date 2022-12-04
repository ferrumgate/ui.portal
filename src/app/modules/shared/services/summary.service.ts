import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditLog } from '../models/auditLog';

import { Configure } from '../models/configure';
import { Network } from '../models/network';
import { SummaryActive, SummaryAgg, SummaryConfig } from '../models/summary';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class SummaryService extends BaseService {

  private _summaryConfigUrl = this.configService.getApiUrl() + '/summary/config';
  private _summaryActiveUrl = this.configService.getApiUrl() + '/summary/active';
  private _summaryLoginTryUrl = this.configService.getApiUrl() + '/summary/logintry';
  private _summaryCreatedTunnelUrl = this.configService.getApiUrl() + '/summary/createtunnel';
  private _summary2FACheckUrl = this.configService.getApiUrl() + '/summary/2facheck';
  private _summaryUserLoginSuccess = this.configService.getApiUrl() + '/summary/userloginsuccess';
  private _summaryUserLoginFailed = this.configService.getApiUrl() + '/summary/userloginfailed';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('summary', captchaService)

  }



  getConfig() {
    const searchParams = new URLSearchParams();
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryConfigUrl, y);
        return this.httpService.get<SummaryConfig>(url);
      })
    )
  }

  getActive() {
    const searchParams = new URLSearchParams();
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryActiveUrl, y);
        return this.httpService.get<SummaryActive>(url);
      })
    )
  }

  getLoginTry(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryLoginTryUrl, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }

  getCreatedTunnel(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryCreatedTunnelUrl, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }


  get2FACheck(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summary2FACheckUrl, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }

  getUserLoginSuccess(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryUserLoginSuccess, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }

  getUserLoginFailed(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryUserLoginFailed, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }





}
