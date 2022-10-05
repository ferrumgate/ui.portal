import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from '../../helper.spec';
import { BaseOAuth } from '../../models/auth';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';

import { AuthOauthComponent } from './auth-oauth.component';

describe('AuthOauthComponent', () => {
  let component: AuthOauthComponent;
  let fixture: ComponentFixture<AuthOauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthOauthComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding and error check', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: BaseOAuth = {
      id: '', baseType: 'oauth', type: 'google', name: 'Google', clientId: 'someid',
      clientSecret: 'somesecret'
    }
    component.model = model;
    tick(100);
    fixture.detectChanges();
    const testIdClientId = 'auth-oauth-clientid-input';
    const testIdClientKey = 'auth-oauth-clientkey-input';
    const testIdSaveButton = 'auth-oauth-ok-button';
    //check value binding
    expectValue(fixture, testIdClientId, 'someid');
    expectValue(fixture, testIdClientKey, 'somesecret');
    expect(component.error.clientId).toBeFalsy();
    const buttonSave = findEl(fixture, testIdSaveButton, false);
    expect(buttonSave).toBeFalsy();

    //check error
    setFieldValue(fixture, testIdClientId, '');
    dispatchFakeEvent(findEl(fixture, testIdClientId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.error.clientId).toBeTruthy();
    expect(component.formGroup.invalid).toBeTrue();


  }));
});
