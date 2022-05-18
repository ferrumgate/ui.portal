import { HttpClient, HttpHeaders, JsonpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, throwError } from 'rxjs';
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
  private _authLocal = this.configService.getApiUrl() + '/auth/login/local';
  private _authRegister = this.configService.getApiUrl() + '/register'
  protected _currentSession: Session | null = null;



  constructor(
    private routerService: Router,
    private configService: ConfigService,
    private httpService: HttpClient) {
    this._currentSession = this.getSavedSession();
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

  loginLocal(email: string, password: string) {
    return this.httpService.post<Session>(this._authLocal, { email: email, password: password }, this._jsonHeader)
      .pipe(map((res: any) => {

        this._currentSession = {
          accessToken: res.body.accessToken,
          refreshToken: res.body.refreshToken,
          currentUser: res.body.user
        }
        this.saveSession();

      }), catchError(err => {
        this._currentSession = null;
        this.saveSession();
        throw err;
      }))
  }

  register(email: string, password: string, captcha?: string, action?: string) {
    return this.httpService.post<{ result: boolean }>(this._authRegister, { email: email, password: password, captcha: captcha, action: action }, this._jsonHeader);
  }


  loginGoogle() {

  }


  logout() {

    sessionStorage.clear();
    this.routerService.navigateByUrl('/login');
  }
}
