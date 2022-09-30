import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

import { click, dispatchFakeEvent, expectContent, findEl, getText, queryByCss, setFieldElementValue, setFieldValue } from '../shared/helper.spec';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';

import { ResetPassComponent } from './resetpass.component';

describe('ResetPassComponent', () => {
  let component: ResetPassComponent;
  let fixture: ComponentFixture<ResetPassComponent>;

  const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['resetPassword']);
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  let captchaService: CaptchaService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPassComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MaterialModule],
      providers: [
        ConfigService,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        TranslationService, TranslateService, NotificationService,
        CaptchaService,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        }
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    captchaService = TestBed.inject(CaptchaService);
    captchaService.setIsEnabled(false);
    fixture = TestBed.createComponent(ResetPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.resetpass')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.resetpass > [fxLayout="row"]').length).toBe(1);
  });

  it('reset password form password input', fakeAsync(async () => {
    const formvalues = {
      password: undefined, passwordAgain: undefined
    }

    expect(component.form.invalid).toBe(true);
    expect(component.form.value).toEqual(formvalues);
    expect(findEl(fixture, 'resetpass-submit-button').properties['disabled']).toBe(true);

    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(2);


    //work on password field
    const password = 'resetpass-password-input';
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
    expect(findEl(fixture, 'resetpass-password-error')).toBeTruthy();

    //set normal password
    setFieldValue(fixture, password, 'Deneme123');
    dispatchFakeEvent(passwordEl.nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.password).toBe('Deneme123');
    expect(passwordForm.errors).toBeFalsy();
    expect(component.error.password).toBeFalsy();
    expect(findEl(fixture, 'resetpass-password-error', false)).toBeFalsy();

  }));



  it('reset password form passwordAgain input', fakeAsync(async () => {
    const formvalues = {
      password: undefined, passwordAgain: undefined
    }

    expect(component.form.invalid).toBe(true);
    expect(component.form.value).toEqual(formvalues);
    expect(findEl(fixture, 'resetpass-submit-button').properties['disabled']).toBe(true);

    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(2);


    //work on passwordAgain field

    const passwordAgain = 'resetpass-password-again-input';
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
    expect(findEl(fixture, 'resetpass-password-again-error')).toBeTruthy();

    //set normal password
    setFieldValue(fixture, 'resetpass-password-input', 'Deneme123');
    dispatchFakeEvent(findEl(fixture, 'resetpass-password-input').nativeElement, 'blur');
    setFieldValue(fixture, passwordAgain, 'Deneme1234');
    dispatchFakeEvent(passwordAgainEl.nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.passwordAgain).toBe('Deneme1234');
    //passwords mustbe same
    expect(passwordAgainForm.errors).toBeTruthy();
    expect(component.error.passwordAgain).toBeTruthy();
    expect(findEl(fixture, 'resetpass-password-again-error', false)).toBeTruthy();

    //set the same value to first field
    setFieldValue(fixture, 'resetpass-password-input', 'Deneme1234');
    dispatchFakeEvent(findEl(fixture, 'resetpass-password-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    //check again
    expect(passwordAgainForm.errors).toBeFalsy();
    expect(component.error.passwordAgain).toBeFalsy();
    expect(findEl(fixture, 'resetpass-password-again-error', false)).toBeFalsy();

    expect(findEl(fixture, 'resetpass-submit-button').properties['disabled']).toBe(false);

  }));



  it('resetpass form submit', fakeAsync(async () => {



    const passwordId = 'resetpass-password-input'
    const passwordAgainId = 'resetpass-password-again-input';

    setFieldValue(fixture, passwordId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');

    setFieldValue(fixture, passwordAgainId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordAgainId).nativeElement, 'blur');

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();

    expect(component.model.password).toBeTruthy();
    expect(component.error.save).toBeFalsy();
    expect(findEl(fixture, 'resetpass-submit-button').properties['disabled']).toBe(false);

    authServiceSpy.resetPassword.and.returnValue(of({ result: true }))
    //click submit
    findEl(fixture, 'resetpass-form').triggerEventHandler('submit', {});
    expect(authServiceSpy.resetPassword).toHaveBeenCalled();


  }));


  /* it('captcha service must be called if needed', fakeAsync(async () => {



    const passwordId = 'resetpass-password-input'
    const passwordAgainId = 'resetpass-password-again-input'


    setFieldValue(fixture, passwordId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');

    setFieldValue(fixture, passwordAgainId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordAgainId).nativeElement, 'blur');

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    captchaService.setIsEnabled(true);

    const captchaServiceSpy = spyOn(captchaService, 'execute');
    captchaServiceSpy.and.returnValue(of('sometoken'))
    httpClientSpy.post.and.returnValue(of({}));
    //authServiceSpy.resetPassword.and.returnValue(of({ result: true }))
    //click submit
    findEl(fixture, 'resetpass-form').triggerEventHandler('submit', {});
    tick(1000);
    fixture.detectChanges();
    expect(captchaServiceSpy).toHaveBeenCalled();


  }));
 */


});
