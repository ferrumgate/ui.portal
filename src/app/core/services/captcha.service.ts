import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { catchError, concat, delay, flatMap, map, merge, mergeAll, mergeMap, Observable, of, Subject, Subscription, switchMap, take, tap, throwError } from 'rxjs';

import { ConfigService } from './config.service';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

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
  constructor(private configService: ConfigService, private recaptchaV3Service: ReCaptchaV3ServiceCustom) {

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
      return this.configService.getCaptchaKey()
        .pipe(
          switchMap((x) => {
            return this.initCaptcha(x);
          }))
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
}
