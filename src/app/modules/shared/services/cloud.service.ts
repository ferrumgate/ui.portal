import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Gateway } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';
import { CloudConfig } from '../models/cloud';

@Injectable({
  providedIn: 'root'
})
export class CloudService extends BaseService {

  private _cloudUrl = this.configService.getApiUrl() + '/cloud';
  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('cloud', captchaService)
  }
  getConfig() {

    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._cloudUrl, 'config', y);
        return this.httpService.get<CloudConfig>(url);
      })
    )
  }
}



