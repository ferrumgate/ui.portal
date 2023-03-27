import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Configure } from '../models/configure';
import { IpIntelligenceList, IpIntelligenceListStatus, IpIntelligenceSource } from '../models/ipIntelligence';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';



@Injectable({
  providedIn: 'root'
})
export class IpIntelligenceService extends BaseService {


  private _ipIntelligenceUrl = this.configService.getApiUrl() + '/ip/intelligence';
  private _ipIntelligenceUrlSource = this.configService.getApiUrl() + '/ip/intelligence/source';
  private _ipIntelligenceUrlSourceCheck = this.configService.getApiUrl() + '/ip/intelligence/source/check';
  private _ipIntelligenceList = this.configService.getApiUrl() + '/ip/intelligence/list';
  private _ipIntelligenceListFile = this.configService.getApiUrl() + '/ip/intelligence/list/file';

  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('ipIntelligence', captchaService)

  }



  getSource() {
    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._ipIntelligenceUrlSource, y);
        return this.httpService.get<{ items: IpIntelligenceSource[] }>(url);
      })
    )
  }

  checkSource(item: IpIntelligenceSource) {
    const source: IpIntelligenceSource =
    {
      id: item.id, type: item.type, name: item.name, apiKey: item.apiKey,
      insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
    };


    return this.preExecute(source).pipe(
      switchMap(y => {
        return this.httpService.post<{ isError: boolean, errorMessage: '' }>(this._ipIntelligenceUrlSourceCheck, y, this.jsonHeader)
      }))
  }


  saveOrupdateSource(item: IpIntelligenceSource) {
    const source: IpIntelligenceSource = {
      id: item.id, type: item.type, name: item.type, insertDate: item.insertDate, updateDate: item.updateDate,
      apiKey: item.apiKey
    }

    return this.preExecute(source).pipe(
      switchMap(y => {
        if (source.id)
          return this.httpService.put<IpIntelligenceSource>(this._ipIntelligenceUrlSource, y, this.jsonHeader)
        else return this.httpService.post<IpIntelligenceSource>(this._ipIntelligenceUrlSource, y, this.jsonHeader)
      }))

  }

  deleteSource(item: IpIntelligenceSource) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._ipIntelligenceUrlSource, `${item.id}`, y);
        return this.httpService.delete(url);

      }))
  }




  getList(search: string) {
    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._ipIntelligenceList, y);
        return this.httpService.get<{ items: IpIntelligenceList[], itemsStatus: IpIntelligenceListStatus[] }>(url);
      })
    )
  }



  saveOrupdateList(item: IpIntelligenceList) {
    const list: IpIntelligenceList = {
      id: item.id, name: item.name, insertDate: item.insertDate, updateDate: item.updateDate,
      file: item.file ? { source: item.file.source, key: item.file.key } : undefined,
      http: item.http ? { checkFrequency: item.http.checkFrequency, url: item.http.url } : undefined,
      labels: item.labels
    }
    return this.preExecute(list).pipe(
      switchMap(y => {
        if (list.id)
          return this.httpService.put<IpIntelligenceList>(this._ipIntelligenceList, y, this.jsonHeader)
        else return this.httpService.post<IpIntelligenceList>(this._ipIntelligenceList, y, this.jsonHeader)
      }))

  }
  uploadListFile(upload: File) {
    const formData = new FormData();
    formData.append('file', upload);
    return this.preExecute({}).pipe(
      switchMap(y => {
        return this.httpService.post(this._ipIntelligenceListFile, formData, {
          reportProgress: true, observe: 'events'
        })
      }))

  }

  deleteList(item: IpIntelligenceList) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._ipIntelligenceList, `${item.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  downloadList(item: IpIntelligenceList) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._ipIntelligenceList, `${item.id}`, 'file', y);
        return this.httpService.get(url);

      }))
  }

  resetList(item: IpIntelligenceList) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._ipIntelligenceList, `${item.id}`, 'reset', y);
        return this.httpService.put(url, {}, this.jsonHeader);

      }))
  }

}
