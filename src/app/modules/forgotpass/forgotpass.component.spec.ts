import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CaptchaService } from 'src/app/core/services/captcha.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { click, dispatchFakeEvent, expectContent, findEl, getText, queryByCss, setFieldElementValue, setFieldValue } from '../shared/helper.spec';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';

import { ForgotPassComponent } from './forgotpass.component';

describe('ForgotPassComponent', () => {
  let component: ForgotPassComponent;
  let fixture: ComponentFixture<ForgotPassComponent>;
  const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['forgotPassword']);
  const captchaServiceSpy = jasmine.createSpyObj('CaptchaService', ['execute']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPassComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MaterialModule],
      providers: [
        ConfigService,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: CaptchaService, useValue: captchaServiceSpy },
        TranslationService, TranslateService, NotificationService,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        }
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.forgotpass')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.forgotpass > [fxLayout="row"]').length).toBe(1);
  });
  it('forgotpass form email input', fakeAsync(async () => {
    const formvalues = {
      email: undefined,
    }

    expect(component.form.invalid).toBe(true);
    expect(component.form.value).toEqual(formvalues);
    expect(findEl(fixture, 'forgotpass-submit-button').properties['disabled']).toBe(true);
    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(1);


    //work on email field
    const emailId = 'forgotpass-email-input';
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
    expect(findEl(fixture, 'forgotpass-email-error')).toBeTruthy();

    //set normal email
    setFieldValue(fixture, emailId, 'someone@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.email).toBe('someone@gmail.com');
    expect(emailForm.errors).toBeFalsy();
    expect(component.error.email).toBeFalsy();
    expect(findEl(fixture, 'forgotpass-email-error', false)).toBeFalsy();

  }));




  it('forgotpass form submit', fakeAsync(async () => {


    const emailId = 'forgotpass-email-input'



    setFieldValue(fixture, emailId, 'test@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');


    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();
    expect(component.model.email).toBeTruthy();

    expect(findEl(fixture, 'forgotpass-submit-button').properties['disabled']).toBe(false);

    authServiceSpy.forgotPassword.and.returnValue(of({ result: true }))
    //click submit
    findEl(fixture, 'forgotpass-form').triggerEventHandler('submit', {});
    expect(authServiceSpy.forgotPassword).toHaveBeenCalled();



  }));


  it('captca service must be called if needed', fakeAsync(async () => {


    const emailId = 'forgotpass-email-input'



    setFieldValue(fixture, emailId, 'test@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');



    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();



    component.isCaptchaEnabled = true;
    captchaServiceSpy.execute.and.returnValue(of('sometoken'))
    authServiceSpy.forgotPassword.and.returnValue(of({ result: true }))
    //click submit
    findEl(fixture, 'forgotpass-form').triggerEventHandler('submit', {});
    expect(captchaServiceSpy.execute).toHaveBeenCalled();
    expect(authServiceSpy.forgotPassword).toHaveBeenCalled();




  }));

});
