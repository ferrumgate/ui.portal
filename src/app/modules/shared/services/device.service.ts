import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { DeviceLog, DevicePosture } from '../models/device';
import { Service } from '../models/service';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends BaseService {

  private _deviceUrl = this.configService.getApiUrl() + '/device';
  private _devicePostureUrl = this.configService.getApiUrl() + '/device/posture';
  private _deviceInsightUrl = this.configService.getApiUrl() + '/insight/device';

  constructor(private httpService: HttpClient,
    private configService: ConfigService,
    private captchaService: CaptchaService) {
    super('device', captchaService)

  }

  saveOrupdateDevicePosture(pst: DevicePosture) {
    const posture: DevicePosture = {
      id: pst.id,

      labels: Array.from(pst.labels || []),
      name: pst.name,
      isEnabled: pst.isEnabled,
      insertDate: pst.insertDate,
      os: pst.os,
      updateDate: pst.updateDate,
      antivirusList: pst.antivirusList?.map(x => { return { name: x.name?.trim() } }).filter(x => x.name),
      clientVersions: pst.clientVersions?.map(x => { return { version: x.version?.trim() } }).filter(x => x.version),
      filePathList: pst.filePathList?.map(x => { return { path: x.path?.trim(), fingerprint: x.fingerprint, sha256: x.sha256 } }).filter(x => x.path),
      firewallList: pst.firewallList?.map(x => { return { name: x.name?.trim() } }).filter(y => y.name),
      discEncryption: pst.discEncryption,
      macList: pst.macList?.map(x => { return { value: x.value?.trim() } }).filter(x => x.value),
      osVersions: pst.osVersions?.map(x => { return { name: x.name?.trim(), release: x.release } }).filter(y => y.name),
      processList: pst.processList?.map(x => { return { path: x.path?.trim(), fingerprint: x.fingerprint, sha256: x.sha256 } }).filter(x => x.path),
      registryList: pst.registryList?.map(x => { return { path: x.path?.trim(), key: x.key, value: x.value } }).filter(x => x.path),
      serialList: pst.serialList?.map(x => { return { value: x.value?.trim() } }).filter(y => y.value),

    }

    return this.preExecute(posture).pipe(
      switchMap(y => {
        if (posture.id)
          return this.httpService.put<DevicePosture>(this._devicePostureUrl, y, this.jsonHeader)
        else return this.httpService.post<DevicePosture>(this._devicePostureUrl, y, this.jsonHeader)
      }))

  }

  deleteDevicePosture(pst: DevicePosture) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._devicePostureUrl, `${pst.id}`, y);
        return this.httpService.delete(url);

      }))
  }

  getDevicePosture(id: string) {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._devicePostureUrl, `${id}`, urlParams);
        return this.httpService.get<Service>(url);

      }))
  }

  getDevicePosture2(search?: string, ids?: string[]) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids.join(','));

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._devicePostureUrl, y);
        return this.httpService.get<{ items: DevicePosture[] }>(url);
      })
    )
  }

  convertToDeviceOptionToBoolean(val?: string): boolean | undefined {
    if (!val) return undefined;
    if (val == 'none') return undefined;
    if (val == 'yes' || val == 'true') return true;
    return false;
  }
  get(startDate?: string, endDate?: string, page?: number, pageSize?: number, searchIsHealthy?: string, search?: string) {

    const searchParams = new URLSearchParams();
    if (startDate)
      searchParams.append('startDate', startDate);
    if (endDate)
      searchParams.append('endDate', endDate);
    if (page)
      searchParams.append('page', page.toString());
    if (pageSize)
      searchParams.append('pageSize', pageSize.toString());
    if (search)
      searchParams.append('search', search);
    let isHealthyParam = this.convertToDeviceOptionToBoolean(searchIsHealthy);
    if (!UtilService.isUndefinedOrNull(isHealthyParam))
      searchParams.append('isHealthy', isHealthyParam ? 'true' : 'false');

    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._deviceInsightUrl, y);
        return this.httpService.get<{ items: DeviceLog[], total: number }>(url);
      })
    )

  }

}
