import { HttpClient, HttpHeaders, JsonpInterceptor } from '@angular/common/http';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, from, map, mergeMap, Observable, of, Subscriber, switchMap, take, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RBACDefault } from '../models/rbac';
import { User } from '../models/user';
import { ConfigService } from './config.service';


export interface Session {
  accessToken: string;
  refreshToken: string;
  currentUser: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  static SessionKey = 'ferrumgate_session';
  private _authLocal = this.configService.getApiUrl() + '/auth/local';
  private _authRegister = this.configService.getApiUrl() + '/register'
  private _confirmUser = this.configService.getApiUrl() + '/user/emailconfirm';
  private _confirm2FA = this.configService.getApiUrl() + '/auth/2fa';
  private _getAccessToken = this.configService.getApiUrl() + '/auth/accesstoken';
  private _getRefreshToken = this.configService.getApiUrl() + '/auth/refreshtoken';
  private _userForgotPass = this.configService.getApiUrl() + '/user/forgotpass'
  private _userResetPass = this.configService.getApiUrl() + '/user/resetpass'
  private _userCurrent = this.configService.getApiUrl() + '/user/current';
  private _authGoogle = this.configService.getApiUrl() + '/auth/google'
  private _authGoogleCallback = this.configService.getApiUrl() + '/auth/google/callback'
  protected _currentSession: Session | null = null;
  protected refreshTokenTimer: any | null = null;
  protected lastExecutionRefreshToken = new Date(0);

  constructor(
    private router: Router,
    private configService: ConfigService,
    private httpService: HttpClient) {
    this._currentSession = this.getSavedSession();
    const refreshTokenMS = environment.production ? 5 * 60 * 1000 : 30 * 1000;
    this.refreshTokenTimer = timer(refreshTokenMS, refreshTokenMS).subscribe(x => {
      const now = new Date();
      if (this.currentSession && this.currentSession?.refreshToken && (now.getTime() - this.lastExecutionRefreshToken.getTime() > refreshTokenMS))
        this.getRefreshToken().pipe(
          catchError(err => {
            this.logout();
            return '';
          })).subscribe();
    })
  }
  getSavedSession() {
    //sessionStorage.setItem('ferrumgate_session', JSON.stringify(this._currentSession));
    const session = sessionStorage.getItem(AuthenticationService.SessionKey)
    if (!session) return null;
    return JSON.parse(session) as Session;
  }
  saveSession() {
    if (!this._currentSession)
      sessionStorage.clear();
    else {
      sessionStorage.setItem(AuthenticationService.SessionKey, JSON.stringify(this._currentSession));
    }
  }

  get currentSession() {
    return this._currentSession;
  }



  private _jsonHeader = {

    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }

  checkSessionIsValid() {
    try {

      const session: Session | null = this.getSavedSession();
      if (session) {
        this._currentSession = session;
        this.getRefreshToken().pipe(
          catchError(err => {
            this.logout();
            return '';
          })).subscribe();;
      }

    } catch (err) {
      // this.logger.console(err);
      this.logout();
    }

  }

  getAccessToken(key: string) {
    return this.httpService.post(this._getAccessToken, { key: key }, this._jsonHeader)
      .pipe(map((resp: any) => {

        this._currentSession = {
          accessToken: resp.accessToken,
          currentUser: resp.user,
          refreshToken: resp.refreshToken
        }
        this.saveSession();
        return this._currentSession;
      }))
  }

  getRefreshToken() {
    return this.httpService.post(this._getRefreshToken, { refreshToken: this.currentSession?.refreshToken }, this._jsonHeader)
      .pipe(map((resp: any) => {

        this._currentSession = {
          accessToken: resp.accessToken,
          currentUser: resp.user,
          refreshToken: resp.refreshToken
        }
        this.saveSession();
        this.lastExecutionRefreshToken = new Date();
        return this._currentSession;
      }))
  }

  loginLocal(username: string, password: string, captcha?: string, action?: string) {
    return this.login(this.httpService.post<Session>(this._authLocal, { username: username, password: password, captcha: captcha, action: action }, this._jsonHeader))

  }

  register(email: string, password: string, captcha?: string, action?: string) {
    return this.httpService.post<{ result: boolean }>(this._authRegister, { username: email, password: password, captcha: captcha, action: action }, this._jsonHeader);
  }


  logout() {

    sessionStorage.clear();
    this._currentSession = null;
    this.router.navigate(['/login']);
  }
  confirmUserEmail(key: string, captcha?: string, action?: string) {

    if (!captcha)
      return this.httpService.post(this._confirmUser, { key: key }, this._jsonHeader);
    else
      return this.httpService.post(this._confirmUser, { key: key, captcha: captcha, action: action }, this._jsonHeader);
  }

  confirm2FA(key: string, token: string, captcha?: string, action?: string) {
    return this.login(this.httpService.post<{ key: string }>(this._confirm2FA, { key: key, twoFAToken: token, captcha: captcha, action: action }, this._jsonHeader))
  }

  forgotPassword(email: string, captcha?: string, action?: string): any {
    return this.httpService.post(this._userForgotPass, { username: email, captcha: captcha, action: action }, this._jsonHeader);
  }

  resetPassword(key: string, password: string, captcha?: string, action?: string): any {
    return this.httpService.post(this._userResetPass, { key: key, pass: password, captcha: captcha, action: action }, this._jsonHeader);
  }

  getUserCurrent() {
    return this.httpService.get<User>(this._userCurrent).pipe(map(user => {
      if (this.currentSession)
        this.currentSession.currentUser = user;
      return user;
    }))
  }

  get googleAuthenticateUrl() {
    return this._authGoogle;
  }

  /**
   * 
   * @param start start authenticating then  execute below phases
   * @returns 
   */
  private login(start: Observable<any>) {
    return start.pipe(
      switchMap((res: any) => {
        let response: {
          key: string, is2FA: boolean
        } = res;
        if (response.is2FA) {
          return from(this.router.navigate(['/user/confirm2fa'], { queryParams: { key: response.key } }));
        } else {
          return this.getAccessToken(response.key)
            .pipe(
              switchMap(x => {
                return this.getUserCurrent();
              }),
              switchMap(x => {
                return this.postLogin();
              }))
        }

      }), catchError(err => {
        this._currentSession = null;
        this.saveSession();
        throw err;
      }))
  }

  private postLogin() {

    if (!this.currentSession)
      throw new Error('something went wrong');

    const isAdmin = this.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleAdmin.name);
    const isReporter = this.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleReporter.name);
    const isUser = this.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleUser.name);

    if ((isAdmin || isReporter)) {
      return from(this.router.navigate(['/screenswitch']));
    }
    else {
      return from(this.router.navigate(['/dashboard']));
    }


  }


  loginCallback(callback: { url: string; params: any; }) {
    let url = '';
    if (callback.url.includes('google')) {
      url = this._authGoogleCallback;
    }

    return this.login(this.httpService.get(url, { params: callback.params }));


  }



}
