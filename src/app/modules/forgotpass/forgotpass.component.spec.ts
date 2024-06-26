import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { dispatchFakeEvent, findEl, queryByCss, setFieldValue } from '../shared/helper.spec';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';

import { ForgotPassComponent } from './forgotpass.component';

describe('ForgotPassComponent', () => {
  let component: ForgotPassComponent;
  let fixture: ComponentFixture<ForgotPassComponent>;
  const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['forgotPassword']);
  let captchaService: CaptchaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPassComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MaterialModule],
      providers: [
        ConfigService,
        { provide: AuthenticationService, useValue: authServiceSpy },

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
      email: null,
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

  /* it('captca service must be called if needed', fakeAsync(async () => {

    const emailId = 'forgotpass-email-input'

    setFieldValue(fixture, emailId, 'test@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    captchaService.setIsEnabled(true);
    const captchaServiceSpy = spyOn(captchaService, 'execute');
    captchaServiceSpy.and.returnValue(of('sometoken'))
    authServiceSpy.forgotPassword.and.returnValue(of({ result: true }))
    //click submit
    findEl(fixture, 'forgotpass-form').triggerEventHandler('submit', {});
    tick(1000);
    fixture.detectChanges();
    expect(captchaServiceSpy).toHaveBeenCalled();
    expect(authServiceSpy.forgotPassword).toHaveBeenCalled();

  })); */

});
