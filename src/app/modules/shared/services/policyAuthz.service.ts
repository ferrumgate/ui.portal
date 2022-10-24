import { A } from '@angular/cdk/keycodes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorizationPolicy, AuthorizationRule } from '../models/authzPolicy';
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
export class PolicyAuthzService extends BaseService {

  private _policyAuthzUrl = this.configService.getApiUrl() + '/policy/authz';
  private _policyAuthzRuleUrl = this.configService.getApiUrl() + '/policy/authz/rule';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('policyAuthz', captchaService)

  }


  get() {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._policyAuthzUrl, urlParams);
        return this.httpService.get<AuthorizationPolicy>(url);

      }))
  }

  getRule(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._policyAuthzRuleUrl, id, urlParams);
        return this.httpService.get<AuthorizationRule>(url);

      }))
  }

  saveOrupdateRule(arule: AuthorizationRule) {
    const rule: AuthorizationRule = {
      id: arule.id,
      isEnabled: arule.isEnabled,
      name: arule.name,
      networkId: arule.networkId,
      profile: { is2FA: arule.profile.is2FA, isPAM: arule.profile.isPAM },
      serviceId: arule.serviceId,
      userOrgroupIds: Array.from(arule.userOrgroupIds || []),

    }

    return this.preExecute(rule).pipe(
      switchMap(y => {
        if (rule.id)
          return this.httpService.put<AuthorizationRule>(this._policyAuthzRuleUrl, y, this.jsonHeader)
        else return this.httpService.post<AuthorizationRule>(this._policyAuthzRuleUrl, y, this.jsonHeader)
      }))
  }

  deleteRule(arule: AuthorizationRule) {


    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._policyAuthzRuleUrl, `${arule.id}`, y);
        return this.httpService.delete(url);

      }))
  }



}
