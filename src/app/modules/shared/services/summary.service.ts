import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { SummaryActive, SummaryAgg, SummaryConfig } from '../models/summary';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService extends BaseService {

  private _summaryConfigUrl = this.configService.getApiUrl() + '/summary/config';
  private _summaryActiveUrl = this.configService.getApiUrl() + '/summary/active';
  private _summaryLoginTryUrl = this.configService.getApiUrl() + '/summary/logintry';
  private _summaryCreatedTunnelUrl = this.configService.getApiUrl() + '/summary/createtunnel';
  private _summary2FACheckUrl = this.configService.getApiUrl() + '/summary/2facheck';
  private _summaryUserLoginSuccessUrl = this.configService.getApiUrl() + '/summary/userloginsuccess';
  private _summaryUserLoginFailedUrl = this.configService.getApiUrl() + '/summary/userloginfailed';
  private _summaryUserLoginTryUrl = this.configService.getApiUrl() + '/summary/user/logintry';
  private _summaryUserLoginTryHoursUrl = this.configService.getApiUrl() + '/summary/user/logintryhours';
  private timeZone = '00:00';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('summary', captchaService)
    const diff = new Date().getTimezoneOffset();
    this.timeZone = this.toHoursAndMinutes(diff);
  }

  toHoursAndMinutes(totalMinutes: number) {
    const isMinus = totalMinutes < 0;
    const hours = Math.floor(Math.abs(totalMinutes) / 60);
    const minutes = Math.abs(totalMinutes) % 60;

    return `${isMinus ? '+' : '-'}${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
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
    searchParams.append("timeZone", this.timeZone);
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
    searchParams.append("timeZone", this.timeZone);
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
    searchParams.append("timeZone", this.timeZone);
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
        const url = this.joinUrl(this._summaryUserLoginSuccessUrl, y);
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
        const url = this.joinUrl(this._summaryUserLoginFailedUrl, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }

  getUserLoginTry(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    searchParams.append("timeZone", this.timeZone);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryUserLoginTryUrl, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }

  getUserLoginTryHours(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append("startDate", startDate);
    if (endDate)
      searchParams.append("endDate", endDate);
    searchParams.append("timeZone", this.timeZone);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._summaryUserLoginTryHoursUrl, y);
        return this.httpService.get<SummaryAgg>(url);
      })
    )
  }

}
