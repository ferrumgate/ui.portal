import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { checkField, dispatchFakeEvent, expectCheckValue, expectText, expectValue, findEl, findEls, queryByCss, setFieldValue } from '../helper.spec';
import { Group } from '../models/group';
import { Gateway, Network } from '../models/network';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';


import { T2FAComponent } from './t2fa.component';

describe('T2FAComponent', () => {
  let component: T2FAComponent;
  let fixture: ComponentFixture<T2FAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [T2FAComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
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
    fixture = TestBed.createComponent(T2FAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();

    component.t2faRefresh = {
      key: 'abasd',
      t2FAKey: 'testme'
    }
    component.t2fa = {
      is2FA: true,
      key: 'abasd',
      t2FAKey: 'testme',
      token: ''
    }

    tick(1000);
    fixture.detectChanges();
    const testqrcode = 't2fa-qrcode';
    const testVerifyToken = 't2fa-2facode-input';
    const testEnabledId = 't2fa-checkbox-enabled';
    const testOkButtonId = 't2fa-ok-button';
    component.modelChanged();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.token).toBeFalsy();
    let okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeFalsy();

    component.t2faRefresh = {
      key: 'test',
      t2FAKey: 'newkey'
    }
    tick(1000);
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeFalse();
    expect(component.formError.token).toBeTruthy();
    okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeFalsy();


    setFieldValue(fixture, testVerifyToken, 'adfasdfa')
    dispatchFakeEvent(findEl(fixture, testVerifyToken).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.token).toBeFalsy();
    okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeTruthy();


  }));
});

