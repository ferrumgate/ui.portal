import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { clickByQuery, dispatchFakeEvent, findEl, getValue, setFieldValue } from '../../../helper.spec';
import { CaptchaService } from '../../../services/captcha.service';
import { ConfigService } from '../../../services/config.service';
import { NotificationService } from '../../../services/notification.service';
import { TranslationService } from '../../../services/translation.service';
import { SharedModule } from '../../../shared.module';
import { PolicyAuthnRuleTimeAddComponent } from './policy-authn-rule-time-add.component';

describe('PolicyAuthnRuleTimeAddComponent', () => {
  let component: PolicyAuthnRuleTimeAddComponent;
  let fixture: ComponentFixture<PolicyAuthnRuleTimeAddComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthnRuleTimeAddComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module,
        MatIconTestingModule, RouterTestingModule.withRoutes([])],
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
    fixture = TestBed.createComponent(PolicyAuthnRuleTimeAddComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(fakeAsync(() => {
    flush();
  }))

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding first tab', fakeAsync(async () => {
    expect(component).toBeTruthy();

    //clieck sunday button

    clickByQuery(fixture, '[test-id="policy-authn-rule-timeadd-sunday"]>button');
    tick(1000);
    fixture.detectChanges();

    expect(component.model.days.includes(0)).toBeTrue();

    //click sunday button again
    clickByQuery(fixture, '[test-id="policy-authn-rule-timeadd-sunday"]>button');
    tick(1000);
    fixture.detectChanges();
    expect(component.model.days.includes(0)).toBeFalse();

    const val = getValue(fixture, 'policy-authn-rule-timeadd-start-input');

    setFieldValue(fixture, 'policy-authn-rule-timeadd-start-input', '10:00');
    dispatchFakeEvent(findEl(fixture, 'policy-authn-rule-timeadd-start-input').nativeElement, 'blur');
    tick();
    fixture.detectChanges();

    expect(component.model.startTime).toEqual(600);

    setFieldValue(fixture, 'policy-authn-rule-timeadd-end-input', '22:00');
    dispatchFakeEvent(findEl(fixture, 'policy-authn-rule-timeadd-end-input').nativeElement, 'blur');
    tick();
    fixture.detectChanges();

    expect(component.model.endTime).toEqual(22 * 60);

    //set timezone manually
    component.formGroup.controls.timezone.setValue('abc');
    component.model.timezone = 'abc';

    component.checkFormError();

    expect(component.formGroup.invalid).toBeFalse();

  }));

});

