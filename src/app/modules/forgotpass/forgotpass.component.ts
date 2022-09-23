import { BreakpointObserver } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { ForgotPass } from 'src/app/modules/shared/models/forgotpass';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  isThemeDark = false;
  device: any;
  model: ForgotPass = {};
  isForgotPassSended = false;


  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, InputService.emailValidator])
    }
  );


  error: { email: string, send: string };

  isCaptchaEnabled = false;
  @Output() submitEM = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private captchaService: CaptchaService
  ) {
    this.error = this.resetErrrors();

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.route.queryParams.subscribe(params => {
      this.isCaptchaEnabled = (params.isCaptchaEnabled == 'true');
    })

  }


  ngOnInit(): void {

    /* this.device = this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
      ])
      .pipe(
        map(result => { this.loggerService.debug(result); return result.matches; }),
        shareReplay(),

      ).subscribe(); */


  }

  resetErrrors() {
    return {
      email: '', send: ''
    };
  }

  submit() {

    if (!this.form?.valid || !this.model.email) {
      this.error.send = this.translateService.translate('FormIsInvalid');
      return;
    }


    if (this.isCaptchaEnabled) {
      this.captchaService.execute('forgotpass').pipe(
        switchMap((token: any) => {
          return this.authService.forgotPassword(this.model.email || '', token, 'forgotpass')
        })
      ).subscribe(x => {
        this.isForgotPassSended = true;
        this.error = this.resetErrrors();
      });
    } else {

      this.authService.forgotPassword(this.model.email).subscribe((x: any) => {

        this.isForgotPassSended = true;
        this.error = this.resetErrrors();
      })
    }

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrrors();
    const emailError = this.form.controls['email'].errors;
    if (emailError) {

      if (emailError['required'])
        this.error.email = 'EmailRequired';
      else
        this.error.email = 'EmailInvalid';


    }

  }
  modelChanged($event: any) {
    this.checkFormError();
  }

}
