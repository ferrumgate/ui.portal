import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Gateway } from '../models/network';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  private _gatewayUrl = this.configService.getApiUrl() + '/gateway';
  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {

  }
  private _jsonHeader = {

    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  getNotJoined(captcha?: string, action?: string) {
    const searchParams = new URLSearchParams({ notJoined: 'true' });
    if (captcha)
      searchParams.append('captcha', captcha);
    if (action)
      searchParams.append('action', action);
    const url = this._gatewayUrl + `/${searchParams.toString()}`;

    return this.httpService.get(url);

  }

  /*  getNotJoined2(isCaptchaEnabled: boolean) {
     const searchParams = new URLSearchParams({ notJoined: 'true' });
     this.captchaService.(isCaptchaEnabled, 'gateway')
       .pipe(
         map(x => {
           if (x) {
             searchParams.append('captcha', x as string);
             searchParams.append('action', 'gateway');
           }
         }),
         switchMap(y => {
           const url = this._gatewayUrl + `/${searchParams.toString()}`;
           return this.httpService.get(url);
         })
       )
   } */

  saveOrupdate(gateway: Gateway, captcha?: string, action?: string) {
    const gate = UtilService.clone(gateway);
    delete gate.objId;

    if (gate.id) {
      this.httpService.put(this._gatewayUrl, gate, this._jsonHeader);
    }
  }


}
