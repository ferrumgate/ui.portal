import { BreakpointObserver } from '@angular/cdk/layout';
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


  error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private breakpointObserver: BreakpointObserver,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService
  ) {
    this.error = '';
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

  submit() {
    if (!this.form?.valid || !this.model.email || !this.model.password) {
      this.error = this.translateService.translate('FormIsInvalid');
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
    const messages: string[] = [];
    const emailError = this.form.controls['email'].errors;
    if (emailError) {
      Object.keys(emailError).forEach(x => {
        switch (x) {
          case 'required':
            //messages.push("EmailRequired"); 
            break;
          default:
            messages.push('EmailInvalid'); break;
        }
      })

    }

    const passwordError = this.form.controls['password'].errors;
    if (passwordError) {
      Object.keys(passwordError).forEach(x => {
        switch (x) {
          case 'required':
            //messages.push('PasswordRequired'); 
            break;
          case 'minlength':
            messages.push('PasswordMinLength'); break;

          case 'pattern':
            messages.push('PasswordPattern'); break;
          case 'mismatchedPasswords':
            messages.push('PasswordsMismatch'); break;
          default:
            messages.push('PasswordInvalid'); break;
        }
      })
    }

    const passwordAgainError = this.form.controls['passwordAgain'].errors;
    if (passwordAgainError) {
      Object.keys(passwordAgainError).forEach(x => {
        switch (x) {
          case 'required':
            //messages.push('PasswordAgainRequired'); 
            break;
          case 'minlength':
            messages.push('PasswordAgainMinLength'); break;

          case 'pattern':
            messages.push('PasswordAgainPattern'); break;
          case 'mismatchedPasswords':
            messages.push('PasswordsMismatch'); break;
          default:
            messages.push('PasswordInvalid'); break;
        }
      })
    }

    const translatedMessages: string[] = [];
    messages.forEach(x => {
      translatedMessages.push(this.translateService.translate(x));
    })
    this.error = Array.from(new Set(translatedMessages)).join(', ')
  }
  modelChanged($event: any) {

    this.checkFormError();
  }

}
