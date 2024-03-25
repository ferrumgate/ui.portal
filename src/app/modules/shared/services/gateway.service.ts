import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Gateway } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

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

  saveOrupdate(gateway: Gateway) {
    const gate: Gateway = {
      id: gateway.id, labels: gateway.labels, name: gateway.name,
      isEnabled: gateway.isEnabled, networkId: gateway.networkId
    }

    return this.preExecute(gate).pipe(
      switchMap(y => {
        if (gate.id)
          return this.httpService.put<Gateway>(this._gatewayUrl, y, this.jsonHeader)
        else return this.httpService.post<Gateway>(this._gatewayUrl, y, this.jsonHeader)
      }))

  }

  delete(gateway: Gateway) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._gatewayUrl, `${gateway.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  get(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._gatewayUrl, `${id}`, urlParams);
        return this.httpService.get<Gateway>(url);

      }))
  }

  get2(search?: string, ids?: string, notJoined?: string) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids);
    if (notJoined)
      searchParams.append('notJoined', notJoined);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._gatewayUrl, y);
        return this.httpService.get<{ items: Gateway[] }>(url);
      })
    )

  }

}
