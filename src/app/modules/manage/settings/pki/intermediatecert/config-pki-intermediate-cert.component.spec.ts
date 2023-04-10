import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { dispatchFakeEvent, expectCheckValue, expectValue, findEl, findEls, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { IpIntelligenceList } from 'src/app/modules/shared/models/ipIntelligence';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';


import { ConfigPKIIntermediateCertComponent } from './config-pki-intermediate-cert.component';
import { SSLCertificateEx } from 'src/app/modules/shared/models/sslCertificate';

describe('ConfigPKIIntermediateCertComponent', () => {
  let component: ConfigPKIIntermediateCertComponent;
  let fixture: ComponentFixture<ConfigPKIIntermediateCertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigPKIIntermediateCertComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
        CaptchaService,
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
    fixture = TestBed.createComponent(ConfigPKIIntermediateCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding isSytem', fakeAsync(async () => {
    expect(component).toBeTruthy();

    let item1: SSLCertificateEx = {
      id: '1', name: 'authenticatonEx', labels: ['test'], isEnabled: true,
      insertDate: '01.01.01', updateDate: '', privateKey: 'private key',
      publicCrt: 'public crt', isSystem: true, usages: []

    }
    component.cert = item1;


    tick(1000);
    fixture.detectChanges();

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();

    expectValue(fixture, 'cert-name-input', item1.name);
    expectValue(fixture, 'cert-insertdate-input', '2001-01-01 00:00:00');
    expectValue(fixture, 'cert-pem-input', 'public crt');
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
    expect(deleteButton).toBeFalsy();


  }));


  it('data binding isSytem=false', fakeAsync(async () => {
    expect(component).toBeTruthy();

    let item1: SSLCertificateEx = {
      id: '1', name: 'authenticatonEx', labels: ['test'], isEnabled: true,
      insertDate: '01.01.01', updateDate: '', privateKey: 'private key',
      publicCrt: 'public crt', isSystem: false, usages: []

    }
    component.cert = item1;


    tick(1000);
    fixture.detectChanges();

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();

    expectValue(fixture, 'cert-name-input', item1.name);
    expectValue(fixture, 'cert-insertdate-input', '2001-01-01 00:00:00');
    expectValue(fixture, 'cert-pem-input', 'public crt');
    //expectCheckValue(fixture, 'cert-checkbox-enabled', true);

    //set name to empty

    setFieldValue(fixture, 'cert-name-input', '')
    dispatchFakeEvent(findEl(fixture, 'cert-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();

    const cancelButton = findEl(fixture, 'cert-close-button', false);
    expect(cancelButton).toBeFalsy();

    setFieldValue(fixture, 'cert-name-input', 'test')
    dispatchFakeEvent(findEl(fixture, 'cert-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.cert.isChanged).toBeTrue();

    const deleteButton = findEl(fixture, 'cert-delete-button', false);
    expect(deleteButton).toBeTruthy();


    const cancelButton2 = findEl(fixture, 'cert-close-button', false);
    expect(cancelButton2).toBeTruthy();





  }));
});

