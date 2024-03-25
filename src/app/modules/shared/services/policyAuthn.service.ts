import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuthenticationPolicy, AuthenticationRule } from '../models/authnPolicy';
import { cloneAuthenticationProfile } from '../models/authnProfile';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyAuthnService extends BaseService {

  private _policyAuthnUrl = this.configService.getApiUrl() + '/policy/authn';
  private _policyAuthnRuleUrl = this.configService.getApiUrl() + '/policy/authn/rule';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('policyAuthn', captchaService)

  }

  get() {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._policyAuthnUrl, urlParams);
        return this.httpService.get<AuthenticationPolicy>(url);

      }))
  }

  getRule(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._policyAuthnRuleUrl, id, urlParams);
        return this.httpService.get<AuthenticationRule>(url);

      }))
  }

  saveOrupdateRule(arule: AuthenticationRule) {
    const rule: AuthenticationRule = {
      id: arule.id,
      isEnabled: arule.isEnabled,
      name: arule.name,
      networkId: arule.networkId,
      profile: cloneAuthenticationProfile(arule.profile),
      userOrgroupIds: Array.from(arule.userOrgroupIds || []),
      action: arule.action

    }

    return this.preExecute(rule).pipe(
      switchMap(y => {
        if (rule.id)
          return this.httpService.put<AuthenticationRule>(this._policyAuthnRuleUrl, y, this.jsonHeader)
        else return this.httpService.post<AuthenticationRule>(this._policyAuthnRuleUrl, y, this.jsonHeader)
      }))
  }

  deleteRule(arule: AuthenticationRule) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._policyAuthnRuleUrl, `${arule.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  reorderRule(aRule: AuthenticationRule, prev: number, pivot: string, curr: number) {
    const reorder = {
      previous: prev, current: curr, pivot: pivot
    }
    return this.preExecute(reorder).pipe(
      switchMap(y => {
        let url = this.joinUrl(this._policyAuthnRuleUrl, 'pos', `${aRule.id}`);
        return this.httpService.put<AuthenticationRule>(url, y, this.jsonHeader)
      }))
  }

}
