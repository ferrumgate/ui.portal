import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { RBACDefault } from '../shared/models/rbac';
import { AuthenticationService } from '../shared/services/authentication.service';
import { InputService } from '../shared/services/input.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit, AfterViewInit, AfterContentInit {

  randomPassword = this.generatePassword();
  model = {

    email: 'your@emailaddress.com',
    password: this.randomPassword,
    passwordAgain: this.randomPassword,
    domain: 'ferrumgate.local',
    url: 'https://your.publicurl.com',
    clientNetwork: '100.64.0.0/16',
    serviceNetwork: '172.28.28.0/24'
  };

  //change default user 
  userFormGroup = new FormGroup(
    {
      email: new FormControl(this.model.email, [Validators.required, InputService.emailValidator]),
      password: new FormControl(this.model.password, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      passwordAgain: new FormControl(this.model.passwordAgain, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
    },
    {
      validators: Validators.compose([InputService.matchingPasswords('password', 'passwordAgain')])
    }
  );

  userError = { email: '', password: '', passwordAgain: '' };
  hidePassword = true;
  hidePasswordAgain = true;


  //common settings
  commonFormGroup = new FormGroup(
    {
      domain: new FormControl(this.model.domain, [Validators.required, InputService.domainValidator]),
      url: new FormControl(this.model.url, [Validators.required, InputService.urlValidator]),
    });
  commonError = { domain: '', url: '' };

  // network settings
  networkFormGroup = new FormGroup({
    clientNetwork: new FormControl(this.model.clientNetwork, [Validators.required, InputService.ipCidrValidator]),
    serviceNetwork: new FormControl(this.model.serviceNetwork, [Validators.required, InputService.ipCidrValidator]),
  });

  networkError = { clientNetwork: '', serviceNetwork: '' };
  isLinear = true;


  constructor(private authService: AuthenticationService,) {


  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {


  }


  resetUserErrors() {
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
  userModelChanged($event: any) {

    this.checkUserFormError();
  }

  resetCommonErrors() {
    return {
      domain: '', url: ''
    }
  }
  commonModelChanged($event: any) {
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



  networkModelChanged($event: any) {

    this.checkNetworkModelChanged($event);
  }

  resetNetworkErrors() {
    return {
      clientNetwork: '', serviceNetwork: ''
    }
  }
  checkNetworkModelChanged($event: any) {

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
  }

  save() {

  }


}
