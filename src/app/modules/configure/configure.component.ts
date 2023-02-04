import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, of, switchMap } from 'rxjs';
import { RBACDefault } from '../shared/models/rbac';
import { AuthenticationService } from '../shared/services/authentication.service';
import { CaptchaService } from '../shared/services/captcha.service';
import { ConfigService } from '../shared/services/config.service';
import { ConfigureService } from '../shared/services/configure.service';
import { InputService } from '../shared/services/input.service';
import { NotificationService } from '../shared/services/notification.service';
import { SSubscription } from '../shared/services/SSubscribtion';
import { TranslationService } from '../shared/services/translation.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  allSub = new SSubscription();
  randomPassword = this.generatePassword();
  model = {

    email: 'your@emailaddress.com',
    password: this.randomPassword,
    passwordAgain: this.randomPassword,
    domain: 'ferrumgate.zero',
    url: this.configService.getUrl(),
    clientNetwork: '100.64.0.0/16',
    serviceNetwork: '172.28.28.0/24',
    sshHost: `${this.configService.getHostname()}:9999`
  };

  //change default user 
  userFormGroup = this.createFormGroupUser(this.model);

  userError = { email: '', password: '', passwordAgain: '' };
  hidePassword = true;
  hidePasswordAgain = true;


  //common settings
  commonFormGroup = this.createFormGroupCommon(this.model);

  commonError = { domain: '', url: '' };

  // network settings
  networkFormGroup = this.createFormGroupNetwork(this.model);

  networkError = { clientNetwork: '', serviceNetwork: '', sshHost: '' };
  isLinear = true;

  isThemeDark = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private configService: ConfigService,
    private captchaService: CaptchaService,
    private configureService: ConfigureService,
    private notificationService: NotificationService
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';


  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {


  }


  createFormGroupCommon(model: any) {
    const fmg = new FormGroup(
      {
        domain: new FormControl(model.domain, [Validators.required, InputService.domainValidator]),
        url: new FormControl(model.url, [Validators.required, InputService.urlValidator]),
      });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.commonModelChanged();
      })
    return fmg;
  }

  createFormGroupNetwork(model: any) {

    const fmg = new FormGroup({
      clientNetwork: new FormControl(model.clientNetwork, [Validators.required, InputService.ipCidrValidator]),
      serviceNetwork: new FormControl(model.serviceNetwork, [Validators.required, InputService.ipCidrValidator]),
      sshHost: new FormControl(model.sshHost, [Validators.required, InputService.hostValidator]),
    });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.networkModelChanged();
      })
    return fmg;
  }

  createFormGroupUser(model: any) {
    const fmg = new FormGroup(
      {
        email: new FormControl(model.email, [Validators.required, InputService.emailValidator]),
        password: new FormControl(model.password, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
        passwordAgain: new FormControl(model.passwordAgain, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      },
      {
        validators: Validators.compose([InputService.matchingPasswords('password', 'passwordAgain')])
      }
    );
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.userModelChanged();
      })
    return fmg;
  }


  resetUserErrors() {
    this.checkAllError = '';
    return {
      email: '', password: '', passwordAgain: ''
    };
  }
  checkUserFormError() {
    //check errors 
    this.userError = this.resetUserErrors();

    const emailError = this.userFormGroup.controls['email'].errors;
    if (emailError) {

      if (emailError['required'])
        this.userError.email = 'EmailRequired';
      else
        this.userError.email = 'EmailInvalid';

    }

    const passwordError = this.userFormGroup.controls['password'].errors;
    if (passwordError) {


      if (passwordError['required'])
        this.userError.password = 'PasswordRequired';
      else if (passwordError['minlength'])
        this.userError.password = 'PasswordMinLength';
      else if (passwordError['pattern'])
        this.userError.password = 'PasswordPattern';
      else if (passwordError['mismatchedPasswords'])
        this.userError.password = 'PasswordsMismatch';
      else
        this.userError.password = 'PasswordInvalid';


    }

    const passwordAgainError = this.userFormGroup.controls['passwordAgain'].errors;
    if (passwordAgainError) {
      if (passwordAgainError['required'])
        this.userError.passwordAgain = 'PasswordAgainRequired';
      else if (passwordAgainError['minlength'])
        this.userError.passwordAgain = 'PasswordAgainMinLength';
      else if (passwordAgainError['pattern'])
        this.userError.passwordAgain = 'PasswordAgainPattern';
      else if (passwordAgainError['mismatchedPasswords'])
        this.userError.passwordAgain = 'PasswordsMismatch';
      else
        this.userError.passwordAgain = 'PasswordInvalid';
    }

  }
  userModelChanged() {

    this.checkUserFormError();
  }

  resetCommonErrors() {
    this.checkAllError = '';
    return {
      domain: '', url: ''
    }
  }
  commonModelChanged() {
    this.checkCommonFormError();

  }
  checkCommonFormError() {
    //check errors 
    this.commonError = this.resetCommonErrors();

    const domainError = this.commonFormGroup.controls['domain'].errors;

    if (domainError) {
      if (domainError['required'])
        this.commonError.domain = 'DomainRequired';
      else
        this.commonError.domain = 'DomainInvalid';
    }

    const urlError = this.commonFormGroup.controls['url'].errors;
    if (urlError) {
      if (urlError['required'])
        this.commonError.url = 'UrlRequired';
      else
        this.commonError.url = 'UrlInvalid';
    }

  }


  generatePassword(len = 32) {
    const chars = ["!", "#", "$", "%", "&", "(", ")", "*", "+", ",",
      "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":",
      ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H",
      "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
      "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "]", "_",
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
      "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "}"]
    let password = '';
    for (let i = 0; i < len; ++i) {
      const rand = Math.floor(Math.random() * 10000000) % chars.length;
      password += chars[rand];
    }
    return password;
  }



  networkModelChanged() {

    this.checkNetworkModelChanged();
  }

  resetNetworkErrors() {
    this.checkAllError = '';
    return {
      clientNetwork: '', serviceNetwork: '', sshHost: ''
    }
  }
  checkNetworkModelChanged() {

    this.checkNetworkFormError();

  }
  checkNetworkFormError() {
    //check errors 
    this.networkError = this.resetNetworkErrors();

    const clientNetworkError = this.networkFormGroup.controls['clientNetwork'].errors;

    if (clientNetworkError) {
      if (clientNetworkError['required'])
        this.networkError.clientNetwork = 'ClientNetworkRequired';
      else
        this.networkError.clientNetwork = 'ClientNetworkInvalid';
    }

    const serviceNetworkError = this.networkFormGroup.controls['serviceNetwork'].errors;
    if (serviceNetworkError) {
      if (serviceNetworkError['required'])
        this.networkError.serviceNetwork = 'ServiceNetworkRequired';
      else
        this.networkError.serviceNetwork = 'ServiceNetworkInvalid';
    }

    const sshHostError = this.networkFormGroup.controls['sshHost'].errors;
    if (sshHostError) {
      if (sshHostError['required'])
        this.networkError.sshHost = 'SshHostRequired';
      else
        this.networkError.sshHost = 'SshHostInvalid';
    }
  }
  checkAllError = '';

  save() {
    if (!this.userFormGroup.valid || !this.commonFormGroup.valid || !this.networkFormGroup.valid) {
      this.checkAllError = this.translateService.translate('FormIsInvalid');
      return;
    }


    this.configureService.configure(this.model).pipe(
      switchMap((x: any) => {
        return this.configService.getPublicConfig().pipe(catchError(err => of()))
      })
    ).subscribe(x => {
      this.notificationService.info(this.translateService.translate('SuccessfullyConfigured'))
      this.authService.logout();
    })

  }

}
