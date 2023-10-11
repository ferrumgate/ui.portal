import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from '../../helper.spec';
import { BaseOAuth, BaseOpenId, BaseSaml } from '../../models/auth';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';
import { AuthOpenIdComponent } from './auth-openid.component';



describe('AuthOpenIdComponent', () => {
  let component: AuthOpenIdComponent;
  let fixture: ComponentFixture<AuthOpenIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthOpenIdComponent],
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
    fixture = TestBed.createComponent(AuthOpenIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding and error check', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: BaseOpenId = {
      baseType: 'openId',
      type: 'generic',
      id: 'asdfasfdasf',
      name: 'Auth0/OpenId',
      authName: "auth0",
      tags: [],
      discoveryUrl: 'https://dev-24m7g.us.auth0.com/samlp/pryXTgkqDprtoGOg0RRH26ylKV0V',
      clientId: "someid",
      clientSecret: "somesecret",
      isEnabled: true

    }
    component.model = model;
    tick(100);
    fixture.detectChanges();
    const testIdname = 'auth-openid-name-input';
    const testIdAuthName = 'auth-openid-shortname-input';

    const testIdDiscoveryUrl = 'auth-openid-discoveryurl-input';
    const testIdClientId = 'auth-openid-clientid-input';
    const testIdClientSecret = 'auth-openid-clientsecret-input';

    const testIdSaveButton = 'auth-openid-ok-button';
    //check value binding
    expectValue(fixture, testIdname, model.name);
    expectValue(fixture, testIdAuthName, model.authName || '');
    expectValue(fixture, testIdDiscoveryUrl, model.discoveryUrl);
    expectValue(fixture, testIdClientId, model.clientId);
    expectValue(fixture, testIdClientSecret, model.clientSecret);
    expect(component.error.discoveryUrl).toBeFalsy();
    const buttonSave = findEl(fixture, testIdSaveButton, false);
    expect(buttonSave).toBeFalsy();

    //check error
    setFieldValue(fixture, testIdDiscoveryUrl, '');
    dispatchFakeEvent(findEl(fixture, testIdDiscoveryUrl).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.error.discoveryUrl).toBeTruthy();
    expect(component.formGroup.invalid).toBeTrue();


    //save changes button must be visible
    setFieldValue(fixture, testIdDiscoveryUrl, 'https://test.ferrumgate.com');
    dispatchFakeEvent(findEl(fixture, testIdDiscoveryUrl).nativeElement, 'blur');
    fixture.detectChanges();

    expect(component.error.discoveryUrl).toBeFalsy();
    expect(component.formGroup.valid).toBeTrue();
    findEl(fixture, testIdSaveButton);


  }));
});
