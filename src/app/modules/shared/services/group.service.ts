import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Group } from '../models/group';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  private _groupUrl = this.configService.getApiUrl() + '/group';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('group', captchaService)

  }



  saveOrupdate(group: Group) {
    const gate: Group = {
      id: group.id, labels: group.labels, name: group.name,
      isEnabled: group.isEnabled
    }

    return this.preExecute(gate).pipe(
      switchMap(y => {
        if (gate.id)
          return this.httpService.put<Group>(this._groupUrl, y, this.jsonHeader)
        else return this.httpService.post<Group>(this._groupUrl, y, this.jsonHeader)
      }))

  }

  delete(group: Group) {


    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._groupUrl, `${group.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  get(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._groupUrl, `${id}`, urlParams);
        return this.httpService.get<Group>(url);

      }))
  }

  get2(search?: string, ids?: string) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._groupUrl, y);
        return this.httpService.get<{ items: Group[] }>(url);
      })
    )
  }


  /* getUsers() {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._groupUrl, 'users', urlParams);
        return this.httpService.get<{ items: { id: string, username: string, groupIds: string[] }[] }>(url);

      }))
  } */


}
