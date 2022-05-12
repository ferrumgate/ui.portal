import { BreakpointObserver } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Register } from 'src/app/core/models/register';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CaptchaService } from 'src/app/core/services/captcha.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { InputService } from 'src/app/core/services/input.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isThemeDark = false;
  device: any;
  model: Register = {};
  isRegistered = false;
  hidePasswordAgain = true;
  hidePassword = true;

  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, InputService.emailValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      passwordAgain: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
    },
    {
      validators: Validators.compose([InputService.matchingPasswords('password', 'passwordAgain')])
    }
  );


  error: { email: string, password: string, passwordAgain: string, save: string };

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

    if (!this.form?.valid || !this.model.email || !this.model.password) {
      this.error.save = this.translateService.translate('FormIsInvalid');
      return;
    }


    this.authService.register(this.model.email, this.model.password).subscribe(x => {
      this.isRegistered = true;
      this.error = this.resetErrrors();
    })

  }
  checkFormError() {
    //check errors 
    this.error = this.resetErrrors();
    const emailError = this.form.controls['email'].errors;
    if (emailError) {
      Object.keys(emailError).forEach(x => {
        switch (x) {
          case 'required':
            this.error.email = 'EmailRequired';
            break;
          default:
            this.error.email = 'EmailInvalid'; break;
        }
      })

    }

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
  counter = 0;
  test($event: any) {
    this.counter++;
    switch (this.counter % 3) {
      case 0: this.notificationService.success('success'); break;
      case 1: this.notificationService.error('error'); break;
      case 2: this.notificationService.info('info'); break;

    }

  }

}
