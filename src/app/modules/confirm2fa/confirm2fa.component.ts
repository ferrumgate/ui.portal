import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { RunHelpers } from 'rxjs/testing';
import { Login, Login2FA } from 'src/app/modules/shared/models/login';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { LoggerService } from 'src/app/modules/shared/services/logger.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { RBACDefault } from '../shared/models/rbac';


@Component({
  selector: 'app-confirm2fa',
  templateUrl: './confirm2fa.component.html',
  styleUrls: ['./confirm2fa.component.scss']
})
export class Confirm2FAComponent implements OnInit {
  isThemeDark = false;
  device: any;
  title: string;


  isCaptchaEnabled = false;


  /// 2FA 
  is2FA = false;
  hideToken = false;
  form2FA: FormGroup = new FormGroup(
    {

      token: new FormControl('', [Validators.required])
    }
  );

  model2fa: Login2FA = {};
  error2fa: { token: string };
  //tunnelSessionKey = '';

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

    this.error2fa = this.resetErrors2FA();

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.route.queryParams.subscribe(params => {
      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
      this.model2fa.key = params.key;
      //this.tunnelSessionKey = params.session;
      /* //if tunnel key exits save first
      if (this.tunnelSessionKey)
        this.authService.setTunnelSessionKey(this.tunnelSessionKey);
      else {
        //check storage if exits
        const tunnelSessionKey = this.authService.getTunnelSessionKey();
        if (tunnelSessionKey)
          this.router.navigate(['/user/confirm2fa'], { queryParams: { session: tunnelSessionKey, isCaptchaEnabled: this.isCaptchaEnabled, key: this.model2fa.key } })
      } */
    })
  }

  resetErrors() {
    return {
      email: '', password: '', login: ''
    };
  }

  resetErrors2FA() {
    return {
      token: ''
    };
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }


  ///// 2fa

  modelChanged2FA($event: any) {

    this.checkFormError2FA();
  }

  checkFormError2FA() {
    //check errors 
    this.error2fa = this.resetErrors2FA();
    const tokenError = this.form2FA.controls['token'].errors;
    if (tokenError) {
      Object.keys(tokenError).forEach(x => {
        switch (x) {
          case 'required':
            this.error2fa.token = 'TokenRequired';
            break;
          default:
            this.error2fa.token = 'TokenInvalid'; break;
        }
      })

    }



  }
  submit2FA() {

    if (!this.form2FA?.valid || !this.model2fa.token) {
      this.error2fa.token = this.translateService.translate('FormIsInvalid');
      return;
    }

    if (this.isCaptchaEnabled) {
      this.captchaService.execute('confirm2FA').pipe(
        switchMap((token: any) => {
          return this.authService.confirm2FA(this.model2fa.key || '', this.model2fa.token || '', token, 'confirm2FA');
        })
      ).subscribe();
    } else {
      this.authService.confirm2FA(this.model2fa.key || '', this.model2fa.token || '').subscribe();
    }

  }

}
