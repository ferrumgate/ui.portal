import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';



import { ConfigEmailExternalComponent } from './config-email-external.component';

describe('ConfigEmailExternalComponent', () => {
  let component: ConfigEmailExternalComponent;
  let fixture: ComponentFixture<ConfigEmailExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigEmailExternalComponent],
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
    fixture = TestBed.createComponent(ConfigEmailExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('binding data', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      type: 'google', fromname: 'testme', user: 'test@test.com', pass: 'somepass', isChanged: false
    }
    tick(1000);
    fixture.detectChanges();

    expectValue(fixture, 'config-email-external-user-input', 'test@test.com');
    expectValue(fixture, 'config-email-external-pass-input', 'somepass');
    expect(component.formGroup.valid).toBeTruthy();
    expect(component.model.isChanged).toBeFalse();
    findEl(fixture, 'config-email-external-delete-button');
    findEl(fixture, 'config-email-external-send-button');

    // set some invalid data
    setFieldValue(fixture, 'config-email-external-user-input', 'invalidvalue');
    dispatchFakeEvent(findEl(fixture, 'config-email-external-user-input').nativeElement, 'blur');
    tick(1000);
    fixture.detectChanges();

    expect(component.formGroup.invalid).toBeTrue();
    expect(component.model.user).toBe('invalidvalue');
    expect(component.error.user).toBeTruthy();


  }));


});
