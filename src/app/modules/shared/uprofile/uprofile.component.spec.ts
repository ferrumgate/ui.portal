import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, findEl, setFieldValue } from '../helper.spec';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { UProfileComponent } from './uprofile.component';

describe('UProfileComponent', () => {
  let component: UProfileComponent;
  let fixture: ComponentFixture<UProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UProfileComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
        CaptchaService,
        GroupService,
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
    fixture = TestBed.createComponent(UProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();

    component.model = {
      browserTimeout: 5

    }

    tick(1000);
    fixture.detectChanges();

    const testOkButtonId = 'uprofile-ok-button';
    component.modelChanged();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.error.browserTimeout).toBeFalsy();
    let okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeFalsy();

    setFieldValue(fixture, 'browser-idle-timeout', '23')
    dispatchFakeEvent(findEl(fixture, 'browser-idle-timeout').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.error.browserTimeout).toBeFalsy();
    okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeTruthy();

  }));
});

