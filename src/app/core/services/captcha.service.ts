import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { catchError, delay, flatMap, map, mergeMap, of, switchMap, tap, throwError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private initted = false;
  constructor(private configService: ConfigService, private recaptchaV3Service: ReCaptchaV3Service) {

  }
  private init() {
    if (!this.initted) {
      return this.configService.getCaptchaKey()
        .pipe(map(x => {
          const captcha = (this.recaptchaV3Service as any);
          captcha.siteKey = x;
          captcha.init();
          this.initted = true;
          return this.initted;
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
