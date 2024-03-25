import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService extends BaseService {

  private _networkUrl = this.configService.getApiUrl() + '/network';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('network', captchaService)

  }

  get(id: string) {
    const urlParams = new URLSearchParams();
    this.preExecute(urlParams)
  }

  get2(search?: string, ids?: string) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._networkUrl, y);
        return this.httpService.get<{ items: Network[] }>(url);
      })
    )

  }

  saveOrupdate(net: Network) {
    const network: Network = {
      id: net.id, labels: net.labels, name: net.name,
      clientNetwork: net.clientNetwork, serviceNetwork: net.serviceNetwork,
      isEnabled: net.isEnabled, sshHost: net.sshHost
    }

    return this.preExecute(network).pipe(
      switchMap(y => {
        if (network.id)
          return this.httpService.put<Network>(this._networkUrl, y, this.jsonHeader)
        else return this.httpService.post<Network>(this._networkUrl, y, this.jsonHeader)
      }))

  }

  delete(net: Network) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._networkUrl, `${net.id}`, y);
        return this.httpService.delete(url);

      }))
  }

}
