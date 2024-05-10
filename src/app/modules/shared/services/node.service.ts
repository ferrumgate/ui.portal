import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { Node, NodeDetail } from '../models/node';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class NodeService extends BaseService {

  private _nodeUrl = this.configService.getApiUrl() + '/node';
  constructor(private httpService: HttpClient, private configService: ConfigService, private captchaService: CaptchaService) {
    super('node', captchaService)

  }

  get(id: string) {
    const urlParams = new URLSearchParams();
    this.preExecute(urlParams)
  }

  get2(search?: string, ids?: string) {

    const searchParams = new URLSearchParams();
    if (search)
      searchParams.append('search', search);
    if (ids)
      searchParams.append('ids', ids);
    return this.preExecute(searchParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._nodeUrl, y);
        return this.httpService.get<{ items: Node[] }>(url);
      })
    )

  }
  getAliveAll() {
    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {
        const url = this.joinUrl(this._nodeUrl, y);
        return this.httpService.get<{ items: NodeDetail[] }>(url);
      }));
  }

  saveOrupdate(net: Node) {
    const node: Node = {
      id: net.id, labels: net.labels, name: net.name,
    }

    return this.preExecute(node).pipe(
      switchMap(y => {
        if (node.id)
          return this.httpService.put<Node>(this._nodeUrl, y, this.jsonHeader)
        else return this.httpService.post<Node>(this._nodeUrl, y, this.jsonHeader)
      }))

  }

  delete(net: Node) {

    const urlParams = new URLSearchParams();
    return this.preExecute(urlParams).pipe(
      switchMap(y => {

        let url = this.joinUrl(this._nodeUrl, `${net.id}`, y);
        return this.httpService.delete(url);

      }))
  }

}
