import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { click, dispatchFakeEvent, expectContent, findEl, getText, queryByCss, setFieldElementValue, setFieldValue } from '../shared/helper.spec';
import { SharedModule } from '../shared/shared.module';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const authSpy = jasmine.createSpyObj('AuthenticationService', ['register']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), BrowserAnimationsModule, SharedModule],
      providers: [
        ConfigService,
        { provide: AuthenticationService, useValue: authSpy },
        TranslationService, TranslateService, NotificationService
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.register')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.register > [fxLayout="row"]').length).toBe(2);
  });
  it('register form email input', fakeAsync(async () => {
    const formvalues = {
      email: undefined, password: undefined, passwordAgain: undefined
    }

    expect(component.form.invalid).toBe(true);
    expect(component.form.value).toEqual(formvalues);
    expect(findEl(fixture, 'register-submit-button').properties['disabled']).toBe(true);
    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(3);


    //work on email field
    const emailId = 'register-email-input';
    const emailForm = component.form.controls['email'];

    setFieldValue(fixture, emailId, 'someone');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();


    //email
    expect(component.model.email).toBe('someone');
    expect(emailForm.errors).toBeTruthy();
    expect(component.error.email).toBeTruthy();
    expect(findEl(fixture, 'register-email-error')).toBeTruthy();

    //set normal email
    setFieldValue(fixture, emailId, 'someone@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.email).toBe('someone@gmail.com');
    expect(emailForm.errors).toBeFalsy();
    expect(component.error.email).toBeFalsy();
    expect(findEl(fixture, 'register-email-error', false)).toBeFalsy();

  }));

  it('register form password input', fakeAsync(async () => {
    const formvalues = {
      email: undefined, password: undefined, passwordAgain: undefined
    }

    expect(component.form.invalid).toBe(true);
    expect(component.form.value).toEqual(formvalues);
    expect(findEl(fixture, 'register-submit-button').properties['disabled']).toBe(true);

    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(3);


    //work on password field
    const password = 'register-password-input';
    const passwordForm = component.form.controls['password'];
    const passwordEl = findEl(fixture, password);
    setFieldValue(fixture, password, 'somepass');
    dispatchFakeEvent(passwordEl.nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();


    //password must be 1 upper
    expect(component.model.password).toBe('somepass');
    expect(passwordForm.errors).toBeTruthy();
    expect(component.error.password).toBeTruthy();
    expect(findEl(fixture, 'register-password-error')).toBeTruthy();

    //set normal password
    setFieldValue(fixture, password, 'Deneme123');
    dispatchFakeEvent(passwordEl.nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.password).toBe('Deneme123');
    expect(passwordForm.errors).toBeFalsy();
    expect(component.error.password).toBeFalsy();
    expect(findEl(fixture, 'register-password-error', false)).toBeFalsy();

  }));



  it('register form passwordAgain input', fakeAsync(async () => {
    const formvalues = {
      email: undefined, password: undefined, passwordAgain: undefined
    }

    expect(component.form.invalid).toBe(true);
    expect(component.form.value).toEqual(formvalues);
    expect(findEl(fixture, 'register-submit-button').properties['disabled']).toBe(true);

    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(3);


    //work on passwordAgain field

    const passwordAgain = 'register-password-again-input';
    const passwordAgainForm = component.form.controls['passwordAgain'];
    const passwordAgainEl = findEl(fixture, passwordAgain);
    setFieldValue(fixture, passwordAgain, 'somepass');
    dispatchFakeEvent(passwordAgainEl.nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();


    //password must be 1 upper, 1 lower, 1 number at least
    expect(component.model.passwordAgain).toBe('somepass');
    expect(passwordAgainForm.errors).toBeTruthy();
    expect(component.error.passwordAgain).toBeTruthy();
    expect(findEl(fixture, 'register-password-again-error')).toBeTruthy();

    //set normal password
    setFieldValue(fixture, passwordAgain, 'Deneme1234');
    dispatchFakeEvent(passwordAgainEl.nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.passwordAgain).toBe('Deneme1234');
    //passwords mustbe same
    expect(passwordAgainForm.errors).toBeTruthy();
    expect(component.error.passwordAgain).toBeTruthy();
    expect(findEl(fixture, 'register-password-again-error', false)).toBeTruthy();

    //set the same value to first field
    setFieldValue(fixture, 'register-password-input', 'Deneme1234');
    dispatchFakeEvent(findEl(fixture, 'register-password-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    //check again
    expect(passwordAgainForm.errors).toBeFalsy();
    expect(component.error.passwordAgain).toBeFalsy();
    expect(findEl(fixture, 'register-password-again-error', false)).toBeFalsy();

    //set email field
    setFieldValue(fixture, 'register-email-input', 'test@gmail.com');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(findEl(fixture, 'register-submit-button').properties['disabled']).toBe(false);

  }));



  it('register form submit', fakeAsync(async () => {


    const emailId = 'register-email-input'
    const passwordId = 'register-password-input'
    const passwordAgainId = 'register-password-again-input'


    setFieldValue(fixture, emailId, 'test@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');

    setFieldValue(fixture, passwordId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');

    setFieldValue(fixture, passwordAgainId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordAgainId).nativeElement, 'blur');

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();
    expect(component.model.email).toBeTruthy();
    expect(component.model.password).toBeTruthy();
    expect(component.error.save).toBeFalsy();
    expect(findEl(fixture, 'register-submit-button').properties['disabled']).toBe(false);

    authSpy.register.and.returnValue(of({ result: true }))
    //click submit
    findEl(fixture, 'register-form').triggerEventHandler('submit', {});
    expect(authSpy.register).toHaveBeenCalled();



  }));

});
