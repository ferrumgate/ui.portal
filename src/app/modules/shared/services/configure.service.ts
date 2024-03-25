import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Configure } from '../models/configure';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigureService extends BaseService {

  private _configureUrl = this.configService.getApiUrl() + '/configure';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('configure', captchaService)

  }

  configure(data: Configure) {
    return this.preExecute(data).pipe(
      switchMap(y => {
        return this.httpService.post(this._configureUrl, y, this.jsonHeader);
      })
    )
  }

}
