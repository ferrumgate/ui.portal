import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigEmailFerrumComponent } from './config-email-ferrum.component';

describe('ConfigEmailSmtpComponent', () => {
  let component: ConfigEmailFerrumComponent;
  let fixture: ComponentFixture<ConfigEmailFerrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigEmailFerrumComponent],
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
    fixture = TestBed.createComponent(ConfigEmailFerrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('binding data', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      type: 'google', fromname: 'testme', user: 'test@test.com', pass: 'somepass',
      isChanged: false,
      host: 'localhost', port: 587, isSecure: false
    }
    tick(1000);
    fixture.detectChanges();

    expectValue(fixture, 'config-email-smtp-user-input', 'test@test.com');
    expectValue(fixture, 'config-email-smtp-pass-input', 'somepass');
    expectValue(fixture, 'config-email-smtp-host-input', 'localhost');
    expectValue(fixture, 'config-email-smtp-port-input', '587');
    expect(component.formGroup.valid).toBeTruthy();
    expect(component.model.isChanged).toBeFalse();
    findEl(fixture, 'config-email-smtp-delete-button');
    findEl(fixture, 'config-email-smtp-send-button');

    // set some invalid data
    setFieldValue(fixture, 'config-email-smtp-host-input', '');
    dispatchFakeEvent(findEl(fixture, 'config-email-smtp-host-input').nativeElement, 'blur');
    tick(1000);
    fixture.detectChanges();

    expect(component.formGroup.invalid).toBeTrue();
    expect(component.model.host).toBe('');

  }));

});
