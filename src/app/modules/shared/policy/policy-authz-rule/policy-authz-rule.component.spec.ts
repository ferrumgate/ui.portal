import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { GroupComponent } from '../../group/group.component';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { GroupService } from '../../services/group.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';




import { PolicyAuthzRuleComponent } from './policy-authz-rule.component';

describe('PolicyAuthzRuleComponent', () => {
  let component: PolicyAuthzRuleComponent;
  let fixture: ComponentFixture<PolicyAuthzRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthzRuleComponent],
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
    fixture = TestBed.createComponent(PolicyAuthzRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /* it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let group: Group = {
      id: 'groupid', name: 'north', labels: ['test'], isEnabled: true,
    }
    component.group = group;
    tick(1000);
    fixture.detectChanges();
    const testNameId = 'group-name-input';
    const testChipId = 'group-label-chip';
    const testEnabledId = 'group-checkbox-enabled';
    const testOkButtonId = 'group-ok-button';

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();

    expectValue(fixture, testNameId, group.name);
    //    expectCheckValue(fixture, testEnabledId, true);
    const chips = findEls(fixture, testChipId)
    expect(chips.length).toBe(1);

    setFieldValue(fixture, testNameId, '')
    dispatchFakeEvent(findEl(fixture, testNameId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();
    expect(component.formError.name).toBeTruthy();
    const button = findEl(fixture, testOkButtonId, false);
    expect(button).toBeUndefined;


    setFieldValue(fixture, testNameId, 'adfasdfa')
    dispatchFakeEvent(findEl(fixture, testNameId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();
    const button2 = findEl(fixture, testOkButtonId, false);
    expect(button2).toBeUndefined;
    expect(component.group.isChanged).toBeTrue;


  })); */
});

