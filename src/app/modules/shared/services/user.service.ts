import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { SSLCertificate } from '../models/sslCertificate';
import { ApiKey, User2 } from '../models/user';
import { UserProfile } from '../models/userProfile';
import { AuthenticationService } from './authentication.service';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

interface UpdateRequest {
  id: string;
  name?: string;
  is2FA?: boolean;
  isLocked?: boolean;
  labels?: string[],
  roleIds?: string[],
  groupIds?: string[]
}

interface SaveRequest {
  name: string;
  username: string;
  roleIds?: string[];
  labels: string[],
  groupIds?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  private _userUrl = this.configService.getApiUrl() + '/user';
  private _userCurrent2FAUrl = this.configService.getApiUrl() + '/user/current/2fa';
  private _userCurrent2FARefreshUrl = this.configService.getApiUrl() + '/user/current/2fa/rekey';
  private _userCurrentPasswordUrl = this.configService.getApiUrl() + '/user/current/pass';
  private _userInviteUrl = this.configService.getApiUrl() + '/user/invite';

  userProfileChanged: EventEmitter<UserProfile> = new EventEmitter();

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService,
    private authService: AuthenticationService) {
    super('user', captchaService)

    this.authService.authenticated.subscribe(x => {
      const profile = this.getUserProfile(x?.currentUser?.id);
      this.authService.configureIdle(profile.browserTimeout * 60);
    })

  }

  update(user: User2) {
    //only these fields updates
    const updateRequest: UpdateRequest = {
      id: user.id, labels: user.labels, name: user.name,
      is2FA: user.is2FA, isLocked: user.isLocked, roleIds: user.roleIds, groupIds: user.groupIds
    }

    return this.preExecute(updateRequest).pipe(
      switchMap(y => {
        return this.httpService.put<User2>(this._userUrl, y, this.jsonHeader)
      }))

  }
  save(user: User2, createApiKey = false, createCert = false) {
    //only these fields updates

    const saveRequest: SaveRequest = {
      labels: user.labels || [],
      name: user.name, username: user.username, roleIds: user.roleIds, groupIds: user.groupIds
    }

    const urlParams = new URLSearchParams();
    if (createApiKey)
      urlParams.append('apiKey', 'true');
    if (createCert)
      urlParams.append('cert', 'true');

    return this.preExecute(saveRequest).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._userUrl, urlParams);
        return this.httpService.post<{
          user: User2, sensitiveData:
          { apiKey: ApiKey, cert: { publicCrt?: string } }
        }>(url, y, this.jsonHeader)

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
    loginMethods?: string[],
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
    if (loginMethods && loginMethods.length)
      searchParams.append('loginMethods', loginMethods.join(','));
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

  getCurrentUser2FA() {
    const searchParams = new URLSearchParams();
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._userCurrent2FAUrl, y);
        return this.httpService.get<{ is2FA: boolean, key: string, t2FAKey: string }>(url);
      })
    )
  }

  getCurrentUserRefresh2FA() {
    const searchParams = new URLSearchParams();
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._userCurrent2FARefreshUrl, y);
        return this.httpService.get<{ key: string, t2FAKey: string }>(url);
      })
    )
  }

  updateCurrentUser2FA(req: { is2FA: boolean, key?: string, token?: string }) {

    let request = {
      is2FA: req.is2FA, key: req.key, token: req.token
    }
    return this.preExecute(request).pipe(
      switchMap(y => {
        return this.httpService.put(this._userCurrent2FAUrl, y, this.jsonHeader)

      }))
  }

  updateCurrentUserPass(req: { oldPass: string, newPass: string }) {

    let request = {
      oldPass: req.oldPass, newPass: req.newPass
    }
    return this.preExecute(request).pipe(
      switchMap(y => {
        return this.httpService.put(this._userCurrentPasswordUrl, y, this.jsonHeader)

      }))
  }

  invite(req: { emails: string[] }) {

    let request = {
      emails: req.emails
    }
    return this.preExecute(request).pipe(
      switchMap(y => {
        return this.httpService.post<{ results: { email: string, errMsg?: string }[] }>(this._userInviteUrl, y, this.jsonHeader)

      }))

  }

  getSensitiveData(id: string, apiKey: boolean, cert: boolean) {
    const urlParams = new URLSearchParams();
    if (apiKey)
      urlParams.append('apiKey', 'true');
    if (cert)
      urlParams.append('cert', 'true');
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._userUrl, `${id}`, 'sensitiveData', urlParams);
        return this.httpService.get<{ apiKey?: { key: string }, cert?: SSLCertificate }>(url);

      }))
  }

  updateSensitiveData(id: string, apiKey?: ApiKey, cert?: SSLCertificate) {

    let request = {
      apiKey: apiKey, cert: cert
    }
    return this.preExecute(request).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._userUrl, `${id}`, 'sensitiveData');
        return this.httpService.put<{ apiKey?: ApiKey, cert?: SSLCertificate }>(url, y, this.jsonHeader)

      }))
  }

  deleteUserSensitiveData(id: string, isApiKey: boolean, isCert: boolean) {

    const urlParams = new URLSearchParams();
    if (isApiKey)
      urlParams.append('apiKey', 'true');
    if (isCert)
      urlParams.append('cert', 'true');
    return this.preExecute(urlParams).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._userUrl, `${id}`, 'sensitiveData', urlParams);
        return this.httpService.delete<{ apiKey?: ApiKey, cert?: SSLCertificate }>(url);

      }))
  }

  resetUserPassword(id: string, pass: string) {

    let request = {
      id: id, pass: pass
    }
    return this.preExecute(request).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._userUrl, `pass`);
        return this.httpService.put<{}>(url, y, this.jsonHeader)

      }))
  }

  defaultProfile() {
    return {
      browserTimeout: 15
    }
  }

  saveCurrentUserProfile(profile: { browserTimeout: number }) {

    return of('').pipe(
      switchMap(x => this.authService.getUserCurrent()),
      map(x => {

        localStorage.setItem(`profile_for_user_${x.id || 'anonymous'}`, JSON.stringify(profile));
        this.userProfileChanged.emit(profile);
        this.authService.configureIdle(profile.browserTimeout * 60);
      }))
  }

  getCurrentUserProfile() {
    return of('').pipe(
      switchMap(x => this.authService.getUserCurrent()),
      map(x => {
        return this.getUserProfile(x.id || 'anonymous')
      }))

  }
  getUserProfile(id: string) {
    let value = localStorage.getItem(`profile_for_user_${id}`);
    if (value) return JSON.parse(value) as UserProfile;
    return this.defaultProfile();
  }

}
