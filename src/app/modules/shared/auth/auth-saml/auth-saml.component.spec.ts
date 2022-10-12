import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from '../../helper.spec';
import { BaseOAuth, BaseSaml } from '../../models/auth';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';
import { AuthSamlComponent } from './auth-saml.component';



describe('AuthSamlComponent', () => {
  let component: AuthSamlComponent;
  let fixture: ComponentFixture<AuthSamlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthSamlComponent],
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
    fixture = TestBed.createComponent(AuthSamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding and error check', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: BaseSaml = {
      baseType: 'saml',
      type: 'auth0',
      id: 'asdfasfdasf',
      name: 'Auth0/Saml',
      tags: [],
      issuer: 'urn:dev-24wm8.us.auth0.com',
      loginUrl: 'https://dev-24m7g.us.auth0.com/samlp/pryXTgkqDprtoGOg0RRH26ylKV0V',
      fingerPrint: '96:39:6C:F6:ED:DF:07:30:F0:2E:45:95:02:B6:F6:68:B7:2C:11:37',
      cert: `MIIDDTCCAfWgAwIBAgIJDVrH9KeUS+k8MA0GCSqGSIb3DQEBCwUAMCQxIjAgGWRldi0yNHdtOG03Zy51cy5hdXRoMC5jb20wHhcNMjIxMDEwMjIzOTA2WhcNMzYwNjE4MjIzOTA2WjAkMSIwIAYDVQQDExlkZXYtMjR3bThtN2cudXMuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA14riTBaUOB2+OZiEbpL5Cjy4MVl78Qi+Msi6IbmIs8nIGRav2hYsI3/mUex6+dCeqwoKCALByRySTEWhUCRWNsi86ae5CSsRikVBAPtEZqKBuoSthrjXUQT5/UBBOHc+EVUAiNrAEE1DBjpkFPkZfGk974ZukK8MyfliajjmFHGj23vwxJncxfx49kOEalz10M500MNldl+Kl628i//y3QiojTsNvPK4SiORFBR89DnWJoB/m6npsm9tkRKUFuYNedVEDru+8aac6LVrKkimDOUzXecAbCm7+td4rXCyV25cc3Pp0sHUYFYk4NoqzW6kJtddFcRQi+xo5JqcPjtunwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRZYMCT4GSETh+A4Ji9wWJxlcv53zAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBACNDPiTHjyeFUIOTWnnZbTZil0nf+yrA6QVesV5+KJ9Ek+YgMrnZ4KdXEZZozUgiGsER1RjetWVYnv3AmEvML0CY/+xJu2bCfwQssSXFLQGdv079V81Mk2+Hz8gQgruLpJpfENQCsbWm3lXQP4F3avFw68HB62rr6jfyEIPb9n8rw/pj57y5ZILl97sb3QikgRh1pTEKVz05WLeHdGPE30QWklGDYxqv2/TbRWOUsdXjjbpE6pIfTUX5OLqGRbrtdHL9fHbhVOfqczALtneEjv5o/TpB3Jo2w9RU9AgMYwWT2Hpqop/fe9fyDQ+u5Hz7ZnADi/oktGBzm8/Y03WpkuM=`,
      usernameField: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      nameField: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      isEnabled: true

    }
    component.model = model;
    tick(100);
    fixture.detectChanges();
    const testIdLoginUrl = 'auth-saml-loginurl-input';
    const testIdIssuer = 'auth-saml-issuer-input';
    const testIdCert = 'auth-saml-cert-input';
    const testIdUsernameField = 'auth-saml-usernamefield-input';
    const testIdNameField = 'auth-saml-namefield-input';
    const testIdSaveButton = 'auth-saml-ok-button';
    //check value binding
    expectValue(fixture, testIdLoginUrl, model.loginUrl);
    expectValue(fixture, testIdIssuer, model.issuer);
    expectValue(fixture, testIdCert, model.cert);
    expectValue(fixture, testIdUsernameField, model.usernameField);
    expectValue(fixture, testIdNameField, model.nameField);
    expect(component.error.loginUrl).toBeFalsy();
    const buttonSave = findEl(fixture, testIdSaveButton, false);
    expect(buttonSave).toBeFalsy();

    //check error
    setFieldValue(fixture, testIdLoginUrl, '');
    dispatchFakeEvent(findEl(fixture, testIdLoginUrl).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.error.loginUrl).toBeTruthy();
    expect(component.formGroup.invalid).toBeTrue();


    //save changes button must be visible
    setFieldValue(fixture, testIdLoginUrl, 'adfafaswew');
    dispatchFakeEvent(findEl(fixture, testIdLoginUrl).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.error.loginUrl).toBeFalsy();
    expect(component.formGroup.valid).toBeTrue();
    findEl(fixture, testIdSaveButton);


  }));
});
