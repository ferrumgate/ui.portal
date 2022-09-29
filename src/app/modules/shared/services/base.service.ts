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

    preExecute(data: any) {
        return this._captchaService.executeIfEnabled(this.action).pipe(map(x => {
            if (x) {
                if (data instanceof URLSearchParams) {
                    data.append('captcha', x as string);
                    data.append('action', this.action);
                    return data;
                } else
                    if (data) {
                        return { ...data, captcha: x, action: this.action }
                    }
            } else return data;
        }))
    }
}