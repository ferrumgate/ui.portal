import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { LoggerService } from 'src/app/modules/shared/services/logger.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { Login, Login2FA } from '../shared/models/login';
import { RBACDefault } from '../shared/models/rbac';


@Component({
  selector: 'app-logincallback',
  templateUrl: './logincallback.component.html',
  styleUrls: ['./logincallback.component.scss']
})
export class LoginCallbackComponent implements OnInit {
  isThemeDark = false;
  device: any;
  title: string;


  isCaptchaEnabled = false;


  @Output() submitEM = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private captchaService: CaptchaService) {
    this.title = "Title";


    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';


    this.route.queryParams.subscribe(params => {

      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
      const callback = { url: '', params: {}, captcha: null, action: null };
      callback.url = this.router.url;
      callback.params = JSON.parse(JSON.stringify(params));//params object cannot extented
      //authenticating with google and redirect afterwards
      if (callback.url.includes('/callback') && Object.keys(params).filter(x => x != 'isCaptchaEnable').length)
        of('').pipe(
          delay(1000),
          switchMap(y => {
            if (this.isCaptchaEnabled)
              return this.captchaService.execute('callback')
                .pipe(
                  switchMap((token: any) => {
                    return this.authService.loginCallback(callback, token, 'callback');
                  }));
            else return of(null)
              .pipe(
                switchMap(() => {
                  return this.authService.loginCallback(callback);
                })
              )
          })
        ).subscribe();

    })
  }


  ngOnInit(): void {

  }

}
