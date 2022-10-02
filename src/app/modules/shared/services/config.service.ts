import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigCaptcha, ConfigCommon } from '../models/config';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';

import { TranslationService } from './translation.service';



@Injectable({
  providedIn: 'root'
})
export class ConfigService extends BaseService {

  userId = 'empty';
  constructor(private translationservice: TranslationService, private http: HttpClient,
    private captchaService: CaptchaService) {
    super('config', captchaService)
    //set default zero config
    this.dynamicConfig = {
      captchaSiteKey: '', isConfigured: 0,
      login: {
        local: { isForgotPassword: 0, isRegister: 0 }, google: undefined, linkedin: undefined
      }
    };
  }
  links = {
    documents: 'https://ferrumgate/document',
    support: "https://ferrumgate/support",
    privacy: "https://ferrumgate/privacy",
    about: "https://ferrumgate/about",
    commonHelp: "https://ferrumgate/doc/settings/common",
    captchaHelp: "https://ferrumgate/doc/captcha"

  }
  changeUser(userId: string) {
    this.userId = userId;
  }


  init(userId?: string) {
    this.changeUser(userId || 'empty');
    const language = this.getLanguage();
    this.translationservice.initLanguages(language);
    if (language) {
      this.translationservice.setDefaultLang(language);
      this.translationservice.use(language);
    }
    const theme = this.getTheme();
    this.themeChanged.emit(theme);

    //try to get config

    this.getPublicConfig().pipe(catchError(err => of())).subscribe();

  }


  getApiUrl(): string {
    return window.location.protocol
      + '//' + window.location.hostname
      // tslint:disable-next-line: triple-equals
      + (window.location.port != '' ? (':' + window.location.port) : '') + '/api';
  }


  langChanged: EventEmitter<string> = new EventEmitter();

  saveLanguage(lang: string) {

    localStorage.setItem(`language_for_user_${this.userId}`, lang);
    this.translationservice.setDefaultLang(lang);
    this.translationservice.use(lang);
    this.langChanged.emit('lang');
  }
  getLanguage(): string | undefined {
    const language = localStorage.getItem(`language_for_user_${this.userId}`);
    return language || undefined;
  }

  // theme functions

  themeChanged: EventEmitter<string> = new EventEmitter();
  saveTheme(theme: string) {

    localStorage.setItem(`theme_for_user_${this.userId}`, theme);

    this.themeChanged.emit(theme);
  }
  getTheme() {
    const theme = localStorage.getItem(`theme_for_user_${this.userId}`);
    return theme || 'white';

  }

  dynamicConfig: {
    captchaSiteKey: string,
    isConfigured: number,
    login: {
      local: {
        isForgotPassword: number,
        isRegister: number,
      },
      google: object | undefined,
      linkedin: object | undefined
    }
  };

  getPublicConfig() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x =>
        this.http.get(this.getApiUrl() + `/config/public`)
      ),
      map((x: any) => {
        this.dynamicConfig = x;
        return x;
      }))
  }


  get captchaKey() {
    return this.dynamicConfig.captchaSiteKey;

  }
  get isEnabledForgotPassword() {

    return this.dynamicConfig.login.local.isForgotPassword;

  }
  get isEnabledRegister() {
    return this.dynamicConfig.login.local.isRegister;

  }

  get isLoginEnabledGoogle() {
    return this.dynamicConfig.login.google;
  }
  get isLoginEnabledLinkedin() {
    return this.dynamicConfig.login.linkedin
  }

  get isAllReadyConfigured() {
    return this.dynamicConfig.isConfigured;
  }


  getCommonConfig() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        return this.http.get<ConfigCommon>(this.getApiUrl() + `/config/common`);
      }))
  }

  saveCommonConfig(config: ConfigCommon) {
    const parameter: ConfigCommon = {
      url: config.url, domain: config.domain
    };
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        return this.http.put<ConfigCommon>(this.getApiUrl() + `/config/common`, x, this.jsonHeader);
      })
    )
  }

  getCaptcha() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        return this.http.get<ConfigCaptcha>(this.getApiUrl() + `/config/captcha`);
      }))
  }

  saveCaptcha(config: ConfigCaptcha) {
    const parameter: ConfigCaptcha = {
      server: config.server, client: config.client
    };
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        return this.http.put<ConfigCaptcha>(this.getApiUrl() + `/config/captcha`, x, this.jsonHeader);
      })
    )
  }

}
