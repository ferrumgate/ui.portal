import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Country } from '../models/country';
import { TimeZone } from '../models/timezone';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseService {

  private _countryUrl = this.configService.getApiUrl() + '/data/country';
  private _timeZoneUrl = this.configService.getApiUrl() + '/data/timezone';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('data', captchaService)

  }

  getCountry() {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._countryUrl, urlParams);
        return this.httpService.get<{ items: Country[] }>(url);

      }))
  }

  getTimeZone() {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._timeZoneUrl, urlParams);
        return this.httpService.get<{ items: TimeZone[] }>(url);

      }))
  }

}
