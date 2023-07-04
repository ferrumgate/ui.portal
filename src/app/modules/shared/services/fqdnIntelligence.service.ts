import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Configure } from '../models/configure';
import { Network } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { saveAs } from 'file-saver';
import { FqdnIntelligenceCategory, FqdnIntelligenceList, FqdnIntelligenceListStatus, FqdnIntelligenceSource } from '../models/fqdnIntelligence';


@Injectable({
  providedIn: 'root'
})
export class FqdnIntelligenceService extends BaseService {


  private _fqdnIntelligenceUrl = this.configService.getApiUrl() + '/fqdn/intelligence';
  private _fqdnIntelligenceUrlSource = this.configService.getApiUrl() + '/fqdn/intelligence/source';

  private _fqdnIntelligenceUrlSourceCheck = this.configService.getApiUrl() + '/fqdn/intelligence/source/check';
  private _fqdnIntelligenceList = this.configService.getApiUrl() + '/fqdn/intelligence/list';
  private _fqdnIntelligenceListFile = this.configService.getApiUrl() + '/fqdn/intelligence/list/file';
  private _fqdnIntelligenceCategory = this.configService.getApiUrl() + '/fqdn/intelligence/category';

  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('fqdnIntelligence', captchaService)

  }

  getCategory() {
    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._fqdnIntelligenceCategory, y);
        return this.httpService.get<{ items: FqdnIntelligenceCategory[] }>(url);
      })
    )
  }

  getSource() {
    const searchParams = new URLSearchParams();

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._fqdnIntelligenceUrlSource, y);
        return this.httpService.get<{ items: FqdnIntelligenceSource[] }>(url);
      })
    )
  }

  checkSource(item: FqdnIntelligenceSource) {
    const source: FqdnIntelligenceSource =
    {
      id: item.id, type: item.type, name: item.name, apiKey: item.apiKey,
      insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
    };


    return this.preExecute(source).pipe(
      switchMap(y => {
        return this.httpService.post<{ isError: boolean, errorMessage: '' }>(this._fqdnIntelligenceUrlSourceCheck, y, this.jsonHeader)
      }))
  }


  saveOrupdateSource(item: FqdnIntelligenceSource) {
    const source: FqdnIntelligenceSource = {
      id: item.id, type: item.type, name: item.type, insertDate: item.insertDate, updateDate: item.updateDate,
      apiKey: item.apiKey
    }

    return this.preExecute(source).pipe(
      switchMap(y => {
        if (source.id)
          return this.httpService.put<FqdnIntelligenceSource>(this._fqdnIntelligenceUrlSource, y, this.jsonHeader)
        else return this.httpService.post<FqdnIntelligenceSource>(this._fqdnIntelligenceUrlSource, y, this.jsonHeader)
      }))

  }

  deleteSource(item: FqdnIntelligenceSource) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._fqdnIntelligenceUrlSource, `${item.id}`, y);
        return this.httpService.delete(url);

      }))
  }




  getList(search?: string) {
    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._fqdnIntelligenceList, y);
        return this.httpService.get<{ items: FqdnIntelligenceList[], itemsStatus: FqdnIntelligenceListStatus[] }>(url);
      })
    )
  }



  saveOrupdateList(item: FqdnIntelligenceList) {
    const list: FqdnIntelligenceList = {
      id: item.id, name: item.name, insertDate: item.insertDate, updateDate: item.updateDate,
      file: item.file ? { source: item.file.source, key: item.file.key } : undefined,
      http: item.http ? { checkFrequency: item.http.checkFrequency, url: item.http.url } : undefined,
      labels: item.labels,
      splitter: item.splitter, splitterIndex: item.splitterIndex
    }
    return this.preExecute(list).pipe(
      switchMap(y => {
        if (list.id)
          return this.httpService.put<FqdnIntelligenceList>(this._fqdnIntelligenceList, y, this.jsonHeader)
        else return this.httpService.post<FqdnIntelligenceList>(this._fqdnIntelligenceList, y, this.jsonHeader)
      }))

  }
  uploadListFile(upload: File) {
    const formData = new FormData();
    formData.append('file', upload);
    return this.preExecute({}).pipe(
      switchMap(y => {
        return this.httpService.post(this._fqdnIntelligenceListFile, formData, {
          reportProgress: true, observe: 'events'
        })
      }))

  }

  deleteList(item: FqdnIntelligenceList) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._fqdnIntelligenceList, `${item.id}`, y);
        return this.httpService.delete(url);

      }))
  }


  downloadList(item: FqdnIntelligenceList) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._fqdnIntelligenceList, `${item.id}`, 'file', y);
        return this.httpService.get(url, { responseType: 'blob' });

      }),
      switchMap(data => {
        const filename = `${item.name}_${new Date().toISOString()}.list`;
        //let blob = new Blob([data], { type: 'application/txt' });
        //FileSaver.saveAs(data, "hello world.txt");
        saveAs(data, filename);

        // var downloadURL = window.URL.createObjectURL(data);


        // window.open(this.downloadUrl(item) + '/' + data.key, '_self');
        return of({});
      }))
  }

  resetList(item: FqdnIntelligenceList) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._fqdnIntelligenceList, `${item.id}`, 'reset', y);
        return this.httpService.put(url, {}, this.jsonHeader);

      }))
  }

}
