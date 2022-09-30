import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';



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
