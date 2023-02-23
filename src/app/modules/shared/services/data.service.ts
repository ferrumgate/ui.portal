import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Country } from '../models/country';
import { Group } from '../models/group';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseService {

  private _countryUrl = this.configService.getApiUrl() + '/data/country';

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


}
