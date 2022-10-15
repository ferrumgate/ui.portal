import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

import { CaptchaService } from "./captcha.service";


export class BaseService {

    /**
     *
     */
    constructor(protected action: string, private _captchaService: CaptchaService) {


    }
    protected jsonHeader = {

        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })

    }

    preExecute<T>(data: T) {
        return this._captchaService.executeIfEnabled(this.action).pipe(map(x => {
            if (x) {
                if (data instanceof URLSearchParams) {
                    data.append('captcha', x as string);
                    data.append('action', this.action);
                    return data;
                } else
                    if (data) {
                        (data as any).captcha = x;
                        (data as any).action = this.action;
                        return data
                    }
                return data;
            } else return data;
        }))
    }

    joinUrl(...items: any[]) {
        let url = items.length ? items[0] : '';
        for (let i = 1; i < items.length; ++i) {
            const x = items[i];
            if (x instanceof URLSearchParams) {
                const param = x.toString();
                if (param)
                    url += `?${param}`;
            }
            else {
                const param = x?.toString();
                if (param)
                    url += param.startsWith('/') ? `${param}` : `/${param}`;
            }

        }
        return url;
    }
}