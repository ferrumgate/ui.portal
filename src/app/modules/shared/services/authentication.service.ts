import { HttpClient, HttpHeaders, JsonpInterceptor } from '@angular/common/http';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, from, map, mergeMap, Observable, of, Subscriber, switchMap, take, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RBACDefault } from '../models/rbac';
import { User } from '../models/user';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';


export interface Session {
  accessToken: string;
  refreshToken: string;
  currentUser: User
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends BaseService {

  //after authentication all session related items saved to session storage
  static StorageSessionKey = 'ferrumgate_session';
  // we need to store tunnel session key for later usage
  static StorateTunnelSessionKey = 'ferrumgate_tunnel_session_key';
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
    private httpService: HttpClient,
    private captchaService: CaptchaService) {
    super('authentication', captchaService)
    this._currentSession = this.getSavedSession();
    const refreshTokenMS = environment.production ? 5 * 60 * 1000 : 30 * 1000;

    this.refreshTokenTimer = timer(refreshTokenMS, refreshTokenMS).subscribe(x => {
      const now = new Date();
      if (this.currentSession && this.currentSession?.refreshToken && (now.getTime() - this.lastExecutionRefreshToken.getTime() > refreshTokenMS))

        this.getRefreshToken().pipe(
          switchMap(x => {
            return this.getUserCurrent();
          }),
          catchError(err => {
            this.logout();
            return '';
          })).subscribe();
    })
  }
  getSavedSession() {
    const session = sessionStorage.getItem(AuthenticationService.StorageSessionKey)
    if (!session) return null;
    return JSON.parse(session) as Session;
  }
  saveSession() {
    if (!this._currentSession) {
      sessionStorage.removeItem(AuthenticationService.StorageSessionKey);
    }
    else {
      sessionStorage.setItem(AuthenticationService.StorageSessionKey, JSON.stringify(this._currentSession));
    }

  }

  get currentSession() {
    return this._currentSession;
  }





  checkSessionIsValid() {
    try {

      const session: Session | null = this.getSavedSession();
      if (session) {
        this._currentSession = session;
        this.getRefreshToken().pipe(
          switchMap(x => {
            return this.getUserCurrent();
          }),
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
    const tunnelSessionKey = this.getTunnelSessionKey();
    return this.httpService.post(this._getAccessToken, { key: key, tunnelKey: tunnelSessionKey }, this.jsonHeader)
      .pipe(map((resp: any) => {

        this._currentSession = {
          accessToken: resp.accessToken,
          currentUser: resp.user,
          refreshToken: resp.refreshToken
        }
        this.saveSession();
        sessionStorage.removeItem(AuthenticationService.StorateTunnelSessionKey);
        return this._currentSession;
      }))
  }

  getRefreshToken() {
    return this.httpService.post(this._getRefreshToken, { refreshToken: this.currentSession?.refreshToken }, this.jsonHeader)
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

  loginLocal(username: string, password: string) {
    let data = { username: username, password: password };
    return this.preExecute(data).pipe(
      switchMap(y => this.login(this.httpService.post<Session>(this._authLocal, y, this.jsonHeader))
      ))

  }

  register(email: string, password: string) {
    let data = { username: email, password: password };
    return this.preExecute(data).pipe(
      switchMap(y => this.httpService.post<{ result: boolean }>(this._authRegister, y, this.jsonHeader))
    );
  }


  logout() {
    sessionStorage.clear();
    this._currentSession = null;
    this.router.navigate(['/login']);
  }
  confirmUserEmail(key: string) {
    let data = { key: key };
    return this.preExecute(data).pipe(
      switchMap(y => this.httpService.post(this._confirmUser, y, this.jsonHeader))
    )
  }

  confirm2FA(key: string, token: string) {
    let data = { key: key, twoFAToken: token };
    return this.preExecute(data).pipe(
      switchMap(y => this.login(this.httpService.post<{ key: string }>(this._confirm2FA, y, this.jsonHeader)))
    )

  }

  forgotPassword(email: string): any {
    let data = { username: email };
    return this.preExecute(data).pipe(
      switchMap(y => this.httpService.post(this._userForgotPass, y, this.jsonHeader))
    )
  }

  resetPassword(key: string, password: string): any {
    let data = { key: key, pass: password };
    return this.preExecute(data).pipe(
      switchMap(y => this.httpService.post(this._userResetPass, y, this.jsonHeader))
    )

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
  /**
   * @summary after login 
   * @returns 
   */
  private postLogin() {

    if (!this.currentSession)
      throw new Error('something went wrong');

    const isAdmin = this.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleAdmin.name);
    const isReporter = this.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleReporter.name);
    const isUser = this.currentSession.currentUser.roles.find(x => x.name == RBACDefault.roleUser.name);

    if ((isAdmin || isReporter)) {
      if (isAdmin && !this.configService.isAllReadyConfigured)
        return from(this.router.navigate(['/configure']));
      else
        return from(this.router.navigate(['/screenswitch']));
    }
    else {

      return from(this.router.navigate(['/dashboard']));
    }


  }


  loginCallback(callback: { url: string; params: any; }) {
    return this.preExecute({} as any).pipe(
      switchMap(y => {
        let url = '';
        if (callback.url.includes('google')) {
          url = this._authGoogleCallback;
        }
        if (y.captcha)
          callback.params.captcha = y.captcha;
        if (y.action)
          callback.params.action = y.action;
        return this.login(this.httpService.get(url, { params: callback.params }));
      })
    )



  }

  /**
   * @summary get tunnel session key, after that remove it from storage
   * @returns 
   */
  getTunnelSessionKey() {
    const val = sessionStorage.getItem(AuthenticationService.StorateTunnelSessionKey);
    return val;

  }

  /**
   * @summary save tunnel session key, if val is empty then remove it from storage
   * @param val 
   */
  setTunnelSessionKey(val: string) {
    if (val)
      sessionStorage.setItem(AuthenticationService.StorateTunnelSessionKey, val);
    else sessionStorage.removeItem(AuthenticationService.StorateTunnelSessionKey);

  }



}
