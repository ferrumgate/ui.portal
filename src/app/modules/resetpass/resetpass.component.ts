import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { RunHelpers } from 'rxjs/testing';
import { ResetPass } from 'src/app/modules/shared/models/resetpass';
import { Login, Login2FA } from 'src/app/modules/shared/models/login';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { LoggerService } from 'src/app/modules/shared/services/logger.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss']
})
export class ResetPassComponent implements OnInit {

  isThemeDark = false;
  device: any;
  model: ResetPass = {};
  isPasswordChanged = false;
  hidePasswordAgain = true;
  hidePassword = true;
  key: string = '';
  form: FormGroup = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      passwordAgain: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
    },
    {
      validators: Validators.compose([InputService.matchingPasswords('password', 'passwordAgain')])
    }
  );


  error: { password: string, passwordAgain: string, save: string };

  isCaptchaEnabled = false;
  @Output() submitEM = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
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
      this.key = params.key;
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
      email: '', password: '', passwordAgain: '', save: ''
    };
  }

  submit() {

    if (!this.form?.valid || !this.model.password) {
      this.error.save = this.translateService.translate('FormIsInvalid');
      return;
    }


    if (this.isCaptchaEnabled) {
      this.captchaService.execute('resetpass').pipe(
        switchMap((token: any) => {
          return this.authService.resetPassword(this.key, this.model.password || '', token, 'resetpass')
        })
      ).subscribe(x => {
        this.isPasswordChanged = true;
        this.error = this.resetErrrors();
      });
    } else {

      this.authService.resetPassword(this.key, this.model.password)
        .subscribe((x: any) => {

          this.isPasswordChanged = true;
          this.error = this.resetErrrors();
        })
    }

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrrors();

    const passwordError = this.form.controls['password'].errors;
    if (passwordError) {
      Object.keys(passwordError).forEach(x => {
        switch (x) {
          case 'required':
            this.error.password = 'PasswordRequired';
            break;
          case 'minlength':
            this.error.password = 'PasswordMinLength'; break;

          case 'pattern':
            this.error.password = 'PasswordPattern'; break;
          case 'mismatchedPasswords':
            this.error.password = 'PasswordsMismatch'; break;
          default:
            this.error.password = 'PasswordInvalid'; break;
        }
      })
    }

    const passwordAgainError = this.form.controls['passwordAgain'].errors;
    if (passwordAgainError) {
      Object.keys(passwordAgainError).forEach(x => {
        switch (x) {
          case 'required':
            this.error.passwordAgain = 'PasswordAgainRequired';
            break;
          case 'minlength':
            this.error.passwordAgain = 'PasswordAgainMinLength'; break;

          case 'pattern':
            this.error.passwordAgain = 'PasswordAgainPattern'; break;
          case 'mismatchedPasswords':
            this.error.passwordAgain = 'PasswordsMismatch'; break;
          default:
            this.error.passwordAgain = 'PasswordInvalid'; break;
        }
      })
    }
  }

  modelChanged($event: any) {

    this.checkFormError();
  }


}
