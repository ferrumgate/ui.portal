import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { TranslationService } from './translation.service';



@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  userId = 'empty';
  constructor(private translationservice: TranslationService, private http: HttpClient) {
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
    about: "https://ferrumgate/about"

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

    return this.http.get(this.getApiUrl() + `/config/public`).pipe(
      map((x: any) => {
        this.dynamicConfig = x;
        return x;
      }));
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
}
