import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthCommon, AuthLocal, BaseLdap, BaseOAuth, BaseSaml } from '../models/auth';

import { ConfigCaptcha, ConfigCommon, ConfigEmail } from '../models/config';
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
      captchaSiteKey: '', isConfigured: false,
      login: {
        local: { isForgotPassword: false, isRegister: false },
        oAuthGoogle: undefined,
        oAuthLinkedin: undefined,
        samlAuth0: undefined
      }
    };
  }
  links = {
    documents: 'https://ferrumgate/document',
    support: "https://ferrumgate/support",
    privacy: "https://ferrumgate/privacy",
    about: "https://ferrumgate/about",
    commonHelp: "https://ferrumgate/doc/setting/common",
    captchaHelp: "https://ferrumgate/doc/setting/captcha",
    emailHelp: "https://ferrumgate/doc/setting/email",
    gatewayHelp: "https://ferrumgate/doc/network",
    networkHelp: "https://ferrumgate/doc/network",
    authLocalHelp: "https://ferrumgate/doc/setting/auth/local",
    authOauthHelp: "https://ferrumgate/doc/setting/auth/oauth",
    authLdapHelp: "https://ferrumgate/doc/setting/auth/ldap",
    authSamlHelp: "https://ferrumgate/doc/setting/auth/saml",
    accountGroupHelp: "https://ferrumgate/doc/account/group",
    accountUserHelp: "https://ferrumgate/doc/account/user",
    serviceHelp: "https://ferrumgate/doc/service",
    policyAuthzHelp: "https://ferrumgate/doc/policy/authorization",
    policyAuthnHelp: "https://ferrumgate/doc/policy/authentication",
    insightActivityHelp: "https://ferrumgate/doc/insight/activity",
    logAuditHelp: "https://ferrumgate/doc/log/audit",




  }
  changeUser(userId: string) {
    this.userId = userId;
    const theme = this.getTheme();
    this.themeChanged.emit(theme);
  }


  init(userId?: string) {
    this.changeUser(userId || 'empty');
    const language = this.getLanguage();
    this.translationservice.initLanguages(language);
    if (language) {
      this.translationservice.setDefaultLang(language);
      this.translationservice.use(language);
    }
    //const theme = this.getTheme();
    //this.themeChanged.emit(theme);

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
    isConfigured: boolean,
    login: {
      local: {
        isForgotPassword: boolean,
        isRegister: boolean,
      },
      oAuthGoogle: object | undefined,
      oAuthLinkedin: object | undefined,
      samlAuth0: object | undefined
    }
  };

  getPublicConfig() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/public', x);
        return this.http.get(url)
      }
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

  get isLoginEnabledOAuthGoogle() {
    return this.dynamicConfig.login.oAuthGoogle;
  }
  get isLoginEnabledOAuthLinkedin() {
    return this.dynamicConfig.login.oAuthLinkedin
  }
  get isLoginEnabledSamlAuth0() {
    return this.dynamicConfig.login.samlAuth0;
  }

  get isAllReadyConfigured() {
    return this.dynamicConfig.isConfigured;
  }


  getCommonConfig() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/common', x);
        return this.http.get<ConfigCommon>(url);
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
        const url = this.joinUrl(this.getApiUrl(), '/config/captcha', x);
        return this.http.get<ConfigCaptcha>(url);
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


  getEmailSettings() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/email', x);
        return this.http.get<ConfigEmail>(url);
      }))
  }

  saveEmailSettings(config: ConfigEmail) {
    const parameter: ConfigEmail = {
      ...config

    };
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        return this.http.put<ConfigEmail>(this.getApiUrl() + `/config/email`, x, this.jsonHeader);
      })
    )
  }
  deleteEmailSettings() {
    const parameter = new URLSearchParams();
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/email', x);
        return this.http.delete(url);
      })
    )
  }
  checkEmailSettings(config: ConfigEmail) {
    const parameter: ConfigEmail = {
      ...config

    };
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        return this.http.post<{ isError: false, errorMessage: string }>(this.getApiUrl() + `/config/email/check`, x, this.jsonHeader);
      })
    )
  }


  getAuthCommon() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/common', x);
        return this.http.get<AuthCommon>(url);
      }))
  }

  getAuthLocal() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/local', x);
        return this.http.get<AuthLocal>(url);
      }))
  }

  saveAuthLocal(local: AuthLocal) {
    const parameter: AuthLocal = {
      id: local.id,
      baseType: local.baseType,
      name: local.name,
      type: local.type,
      isForgotPassword: local.isForgotPassword,
      isRegister: local.isRegister,
      tags: local.tags,
      isEnabled: local.isEnabled
    };
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        if (x.id)
          return this.http.put<AuthLocal>(this.getApiUrl() + `/config/auth/local`, x, this.jsonHeader);
        else
          return this.http.post<AuthLocal>(this.getApiUrl() + `/config/auth/local`, x, this.jsonHeader);
      })
    )
  }


  getAuthOAuthProviders() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/oauth/providers', x);
        return this.http.get<{ items: BaseOAuth[] }>(url);
      }))
  }


  saveAuthOAuthProvider(oauth: BaseOAuth) {
    const parameter: BaseOAuth = {
      id: oauth.id,
      baseType: oauth.baseType,
      name: oauth.name,
      type: oauth.type,
      tags: oauth.tags,
      clientId: oauth.clientId,
      clientSecret: oauth.clientSecret,
      isEnabled: oauth.isEnabled
    }
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        if (x.id)
          return this.http.put<BaseOAuth>(this.getApiUrl() + `/config/auth/oauth/providers`, x, this.jsonHeader);
        else
          return this.http.post<BaseOAuth>(this.getApiUrl() + `/config/auth/oauth/providers`, x, this.jsonHeader);
      }))
  }

  deleteAuthOAuthProvider(oauth: BaseOAuth) {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/oauth/providers', oauth.id, x);
        return this.http.delete<{}>(url);
      }))
  }

  ///////////// ldap

  getAuthLdapProviders() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/ldap/providers', x);
        return this.http.get<{ items: BaseLdap[] }>(url);
      }))
  }


  saveAuthLdapProvider(auth: BaseLdap) {
    const parameter: BaseLdap = {
      id: auth.id,
      baseType: auth.baseType,
      name: auth.name,
      type: auth.type,
      tags: auth.tags,
      groupnameField: auth.groupnameField,
      host: auth.host,
      searchBase: auth.searchBase,
      usernameField: auth.usernameField,
      allowedGroups: auth.allowedGroups,
      bindDN: auth.bindDN,
      bindPass: auth.bindPass,
      searchFilter: auth.searchFilter,
      securityProfile: auth.securityProfile,
      isEnabled: auth.isEnabled

    }
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        if (x.id)
          return this.http.put<BaseLdap>(this.getApiUrl() + `/config/auth/ldap/providers`, x, this.jsonHeader);
        else
          return this.http.post<BaseLdap>(this.getApiUrl() + `/config/auth/ldap/providers`, x, this.jsonHeader);
      }))
  }

  deleteAuthLdapProvider(oauth: BaseLdap) {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/ldap/providers', oauth.id, x);
        return this.http.delete<{}>(url);
      }))
  }

  ///////////// saml

  getAuthSamlProviders() {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/saml/providers', x);
        return this.http.get<{ items: BaseSaml[] }>(url);
      }))
  }


  saveAuthSamlProvider(auth: BaseSaml) {
    const parameter: BaseSaml = {
      id: auth.id,
      baseType: auth.baseType,
      name: auth.name,
      type: auth.type,
      tags: auth.tags,
      securityProfile: auth.securityProfile,
      isEnabled: auth.isEnabled,
      cert: auth.cert,
      issuer: auth.issuer,
      loginUrl: auth.loginUrl,
      nameField: auth.nameField,
      usernameField: auth.usernameField,
      fingerPrint: auth.fingerPrint

    }
    return this.preExecute(parameter).pipe(
      switchMap(x => {
        if (x.id)
          return this.http.put<BaseSaml>(this.getApiUrl() + `/config/auth/saml/providers`, x, this.jsonHeader);
        else
          return this.http.post<BaseSaml>(this.getApiUrl() + `/config/auth/saml/providers`, x, this.jsonHeader);
      }))
  }

  deleteAuthSamlProvider(oauth: BaseSaml) {
    const urlSearchParams = new URLSearchParams();
    return this.preExecute(urlSearchParams).pipe(
      switchMap(x => {
        const url = this.joinUrl(this.getApiUrl(), '/config/auth/saml/providers', oauth.id, x);
        return this.http.delete<{}>(url);
      }))
  }


}
