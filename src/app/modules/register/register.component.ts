import { BreakpointObserver } from '@angular/cdk/layout';
import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Register } from 'src/app/core/models/register';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { InputService } from 'src/app/core/services/input.service';
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


  @Output() submitEM = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService
  ) {
    this.error = this.resetErrrors();

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';


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
    this.initForm();

  }

  initForm() {

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

    if (this.form?.valid && this.model.email && this.model.password) {

      this.authService.register(this.model.email, this.model.password).subscribe(x => {
        this.isRegistered = true;
      })
    }
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

}
