import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject, catchError, map, merge, of, switchMap, throwError } from 'rxjs';

/**
 * a little bit force ng-recaptcha library to load site key late
 */
@Injectable({
  providedIn: 'root'
})
export class ReCaptchaV3ServiceCustom extends (ReCaptchaV3Service as any) {

  onLoad = new Subject();
  constructor(zone: NgZone, @Inject(RECAPTCHA_V3_SITE_KEY) siteKey: string, @Inject(PLATFORM_ID) platformId: Object,) {
    super(zone, siteKey, platformId, undefined, undefined, undefined);
  }
  private init() {
    return;
  }

  public init2(key: string) {
    const mutableSuper = this as any;
    mutableSuper['siteKey'] = key;
    super['init']();
  }

  /** @internal */
  private onLoadComplete = (grecaptcha: ReCaptchaV2.ReCaptcha) => {
    this.grecaptcha = grecaptcha;

    //super['onLoadComplete'](grecaptcha);

    this.onLoad.next(true);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private initted = false;
  private captchaKeyGetted = false;
  constructor(private http: HttpClient,
    private recaptchaV3Service: ReCaptchaV3ServiceCustom,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
    })
  }

  getCaptchaKey() {
    if (this.captchaKeyGetted)
      return of({ captchaSiteKey: this.captchaKey });
    else
      return this.http.get<{ captchaSiteKey: string }>(this.getApiUrl() + `/config/public`).pipe(map(x => {
        this.captchaKey = x.captchaSiteKey || '';
        this.captchaKeyGetted = true;
        return x;
      }))
  }

  captchaKey = '';
  //same method in configservice
  private getApiUrl(): string {
    return window.location.protocol
      + '//' + window.location.hostname
      // tslint:disable-next-line: triple-equals
      + (window.location.port != '' ? (':' + window.location.port) : '') + '/api';
  }
  private initCaptcha(key: string) {
    const onload = this.recaptchaV3Service.onLoad.pipe(map(x => {
      this.initted = true;
      return this.initted;
    }));
    const start = of('').pipe(map(x => {
      this.recaptchaV3Service.init2(key);
      return true;
    }));
    return merge(onload, start);
  }
  private init() {
    if (!this.initted) {
      return this.getCaptchaKey()
        .pipe(
          switchMap(z => this.initCaptcha(this.captchaKey))
        )
    } else return of(this.initted);

  }
  execute(action: string) {

    return this.init()
      .pipe(
        switchMap((x) =>
          this.recaptchaV3Service.execute(action)
        ),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
  private isCaptchaEnabled: boolean = false;
  setIsEnabled(value: boolean) {
    this.isCaptchaEnabled = value;
  }
  getIsEnabled() {
    return this.isCaptchaEnabled;
  }

  executeIfEnabled(action: string) {
    if (this.isCaptchaEnabled && this.captchaKey)
      return this.execute(action).pipe(
        map((x) => {
          this.isCaptchaEnabled = false;
          return x;
        }))
    else
      return of(false)
  }

}
