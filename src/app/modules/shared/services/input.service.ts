import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import validator from 'validator';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  constructor() { }


  /*   static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
      const config: any = {
        'required': 'Required',
        'unsolicitedMailAddress': 'Please enter a reliable e-mail address.',
        'emailAddress': 'Invalid email address',
        'invalidPhoneNumber': 'Invalid phone number',
        'mismatchedPasswords': 'Passwords does not match. Please control and type again.',
        'mismatchedEmails': 'Emails does not match. Please control and type again.',
        'invalidPassword': 'Invalid password. Password must be at least 8 characters long ,contain a number and one capital letter.',
        'minlength': `Minimum length ${validatorValue.requiredLength}`,
        'invalidIp': 'Invalid Ip Address or Ip Range',
        'invalidCaptcha': 'Check to prove you are not a bot',
        'invalidDomain': 'Invalid domain',
      };
  
      return config[validatorName];
    } */

  static emailValidator(control: any) {
    // RFC 2822 compliant regex
    if (control == null || control.value == null || control.value === '' || control.value == 'admin') {
      return null;
    } else if (!control.value.match(/^((?!yopmail.com|boximail.com|eelmail.com|maildrop.cc|mailnesia.com|mintemail.com|mt2015.com|mt2014.com|thankyou2010.com|trash2009.com|mt2009.com|trashymail.com|mytrashmail.com|dispostable.com|trbvn.com|mailinator.com).)*$/)) {
      return { 'invalidEmail': true };
    } else if (validator.isEmail(control.value)) {
      return null;
    } else {
      return { 'invalidEmail': true };
    }
  }



  static captchaValidator(control: any) {
    // RFC 2822 compliant regex
    if (control != null && control.value != '') {
      return null;
    } else {
      return { 'invalidCaptcha': true };
    }
  }

  static passwordValidator(control: any) {
    // {8,100}           - Assert password is between 8 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    // (?=.*[A-Z])        - Assert a string has at least one capital letter
    if (control == null || control.value == null) {
      return null;
    } else if (control.value.match(/^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  static matchingPasswords(passwordKey: string, passwordConfirmationKey: string): any {
    return (group: FormGroup) => {

      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[passwordConfirmationKey];

      if (password.valid) {

        if (confirmPassword.valid || (confirmPassword.invalid && confirmPassword.hasError('mismatchedPasswords'))) {
          confirmPassword.setErrors(null);
          if ((password.value == null || password.value == '') && (confirmPassword.value == null || confirmPassword.value == '')) {
            return null;
          } else if (password.value !== confirmPassword.value) {
            return confirmPassword.setErrors({ 'mismatchedPasswords': true });
          }
        }
        else return null;
      } else {
        return null;
      }
    };
  }

  static matchingEmail(emailKey: string, emailConfirmationKey: string): any {
    return (group: FormGroup) => {
      const email = group.controls[emailKey];
      const confirmEmail = group.controls[emailConfirmationKey];

      if ((email.value == null || email.value == '') && (confirmEmail.value == null || confirmEmail.value == '')) {
        return null;
      } else if (email.value !== confirmEmail.value) {
        return confirmEmail.setErrors({ 'mismatchedEmails': true });
      }
    };
  }
  static domainValidator(control: any) {

    if (control == null || control.value == null) {
      return null;
    } else if (validator.isFQDN(control.value)) {
      return null;
    } else {
      return { 'invalidDomain': true };
    }
  }
  static urlValidator(control: any) {

    if (control == null || control.value == null) {
      return null;
    } else
      if ((control.value.startsWith('http://') || control.value.startsWith('https://')) && validator.isURL(control.value)) {
        return null;
      } else {
        return { 'invalidUrl': true };
      }
  }
  static ipCidrValidator(control: any) {

    if (control == null || control.value == null) {
      return null;
    } else
      if (validator.isIPRange(control.value)) {
        return null;
      } else {
        return { 'invalidCidr': true };
      }
  }
}
