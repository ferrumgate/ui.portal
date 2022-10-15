import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { Group } from '../models/group';
import { User2 } from '../models/user';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';
interface UpdateRequest {
  id: string;
  name?: string;
  is2FA?: boolean;
  isLocked?: boolean;
  labels?: string[],
  roleIds?: string[],
  groupIds?: string[]
}



@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  private _userUrl = this.configService.getApiUrl() + '/user';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('user', captchaService)

  }


  saveOrupdate(user: User2) {
    //only these fields updates
    const request: UpdateRequest = {
      id: user.id, labels: user.labels, name: user.name,
      is2FA: user.is2FA, isLocked: user.isLocked, roleIds: user.roleIds, groupIds: user.groupIds
    }

    return this.preExecute(request).pipe(
      switchMap(y => {
        return this.httpService.put<Group>(this._userUrl, y, this.jsonHeader)

      }))

  }

  delete(user: User2) {


    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._userUrl, `${user.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  get(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._userUrl, `${id}`, urlParams);
        return this.httpService.get<User2>(url);

      }))
  }

  get2(
    page: number = 0, pageSize: number = 0,
    search?: string,
    ids?: string[],
    groupIds?: string[],
    roleIds?: string[],
    is2FA?: string,
    isVerified?: string,
    isLocked?: string,
    isEmailVerified?: string,
    format?: string
  ) {

    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString())
    if (search)
      searchParams.append('search', search);
    if (ids && ids.length)
      searchParams.append('ids', ids.join(','));
    if (groupIds && groupIds.length)
      searchParams.append('groupIds', groupIds.join(','));
    if (roleIds && roleIds.length)
      searchParams.append('roleIds', roleIds.join(','));
    if (is2FA)
      searchParams.append('is2FA', is2FA);
    if (isVerified)
      searchParams.append('isVerified', isVerified);
    if (isLocked)
      searchParams.append('isLocked', isLocked);
    if (isEmailVerified)
      searchParams.append('isEmailVerified', isEmailVerified);
    if (format)
      searchParams.append('format', format);

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._userUrl, y);
        return this.httpService.get<{ items: User2[], total: number }>(url);
      })
    )
  }





}
