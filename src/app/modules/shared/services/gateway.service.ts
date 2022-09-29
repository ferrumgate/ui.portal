import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Gateway } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class GatewayService extends BaseService {

  private _gatewayUrl = this.configService.getApiUrl() + '/gateway';
  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('gateway', captchaService)

  }

  getNotJoined() {
    const searchParams = new URLSearchParams({ notJoined: 'true' });
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this._gatewayUrl + `?${searchParams.toString()}`;
        return this.httpService.get<{ items: Gateway[] }>(url);
      })
    )
  }


  saveOrupdate(gateway: Gateway) {
    const gate: Gateway = {
      id: gateway.id, labels: gateway.labels, name: gateway.name,
      isEnabled: gateway.isEnabled, networkId: gateway.networkId
    }

    return this.preExecute(gate).pipe(
      switchMap(y => {
        if (gate.id)
          return this.httpService.put(this._gatewayUrl, gate, this.jsonHeader)
        else return this.httpService.post(this._gatewayUrl, gate, this.jsonHeader)
      }))

  }

  delete(gateway: Gateway) {
    const gate: Gateway = {
      id: gateway.id, labels: gateway.labels, name: gateway.name,
      isEnabled: gateway.isEnabled, networkId: gateway.networkId
    }


    return this.preExecute(gate).pipe(
      switchMap(y => {
        return of('');
        //this.httpService.delete(this._gatewayUrl + `/${gate.id}`)

      }))
  }


}
