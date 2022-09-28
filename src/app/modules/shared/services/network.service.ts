import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configure } from '../models/configure';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';



@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private _networkUrl = this.configService.getApiUrl() + '/network';
  constructor(private httpService: HttpClient, private configService: ConfigService) {

  }
  private _jsonHeader = {

    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  configure(data: Configure, captcha?: string, action?: string) {
    if (!captcha)
      return this.httpService.post(this._networkUrl, data, this._jsonHeader);
    else
      return this.httpService.post(this._networkUrl, { ...data, captcha: captcha, action: action }, this._jsonHeader);
  }


}
