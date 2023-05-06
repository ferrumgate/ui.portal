import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Group } from '../models/group';
import { Service } from '../models/service';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class ServiceService extends BaseService {

  private _serviceUrl = this.configService.getApiUrl() + '/service';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('service', captchaService)

  }



  saveOrupdate(service: Service) {
    const srv: Service = {
      id: service.id, labels: service.labels,
      name: service.name,
      isEnabled: service.isEnabled,
      networkId: service.networkId, protocol: service.protocol,
      assignedIp: '',
      count: service.count,
      hosts: UtilService.clone(service.hosts),
      ports: UtilService.clone(service.ports)
    }

    return this.preExecute(srv).pipe(
      switchMap(y => {
        if (srv.id)
          return this.httpService.put<Service>(this._serviceUrl, y, this.jsonHeader)
        else return this.httpService.post<Service>(this._serviceUrl, y, this.jsonHeader)
      }))

  }

  delete(service: Service) {


    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._serviceUrl, `${service.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  get(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._serviceUrl, `${id}`, urlParams);
        return this.httpService.get<Service>(url);

      }))
  }

  get2(search?: string, ids?: string[], networkIds?: string[]) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids.join(','));
    if (networkIds && networkIds.length)
      searchParams.append('networkIds', networkIds.join(','));
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._serviceUrl, y);
        return this.httpService.get<{ items: Service[] }>(url);
      })
    )
  }



}
