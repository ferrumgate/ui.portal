import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { dispatchFakeEvent, expectText, expectValue, findEl, setFieldElementValue, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigPKIWebComponent } from './config-pki-web.component';
import { SSLCertificate } from 'src/app/modules/shared/models/sslCertificate';




describe('ConfigPKIWebComponent', () => {
  let component: ConfigPKIWebComponent;
  let fixture: ComponentFixture<ConfigPKIWebComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigPKIWebComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        AuthenticationService,
        ConfigService,
        ConfigureService,
        NotificationService,
        TranslationService,
        ConfirmService,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    confirmService = TestBed.inject(ConfirmService);
    fixture = TestBed.createComponent(ConfigPKIWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    tick(1000);
    fixture.detectChanges();
    const apiKeyInput = findEl(fixture, 'config-ip-intelligence-source-apikey-input', false);
    expect(apiKeyInput).toBeFalsy();

    let item1: SSLCertificate = {
      idEx: '1', name: 'authenticatonEx', labels: ['test'], isEnabled: true,
      insertDate: '01.01.01', updateDate: '01.01.01', privateKey: 'private key',
      publicCrt: 'public crt', isSystem: true

    }
    component.cert = item1;
    tick(1000);
    fixture.detectChanges();

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();


    expectValue(fixture, 'cert-name-input', item1.name);
    expectValue(fixture, 'cert-updatedate-input', '2001-01-01 00:00:00');
    expectValue(fixture, 'cert-pem-input', 'public crt');

    const deleteButton2 = findEl(fixture, 'cert-delete-button', false);
    expect(deleteButton2).toBeTruthy();
    //expectCheckValue(fixture, 'cert-checkbox-enabled', true);

    //set name to empty
    setFieldValue(fixture, 'cert-name-input', '')
    dispatchFakeEvent(findEl(fixture, 'cert-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();

    setFieldValue(fixture, 'cert-name-input', 'test')
    dispatchFakeEvent(findEl(fixture, 'cert-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();

    const deleteButton = findEl(fixture, 'cert-delete-button', false);
    expect(deleteButton).toBeTruthy();



  }));
});
