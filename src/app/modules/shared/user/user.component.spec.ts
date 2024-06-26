import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, expectCheckValue, expectValue, findEl, findEls, getValue, setCheckValue, setFieldValue } from '../helper.spec';
import { RBACDefault } from '../models/rbac';
import { User2 } from '../models/user';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
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
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const groups = [];
    groups.push({ id: 'group1', name: 'North1', isEnabled: true, labels: [] })
    groups.push({ id: 'group2', name: 'North2', isEnabled: true, labels: [] })
    groups.push({ id: 'group3', name: 'North3', isEnabled: true, labels: [] })

    const user1: User2 = {
      username: 'hamza@ferrumgate.com',
      id: 'someid',
      name: 'hamza',
      source: 'local',
      roleIds: ['Admin'],
      labels: ['test'],
      isLocked: true, isVerified: true,
      is2FA: true,
      insertDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      groupIds: ['group1']

    }
    const roles = [RBACDefault.roleAdmin, RBACDefault.roleReporter, RBACDefault.roleUser];
    component.roles = roles;
    component.groups = groups;
    component.user = user1;
    tick(1000);
    fixture.detectChanges();
    const testNameId = 'user-name-input';
    const testGroupId = 'user-group-select';
    const testSourceId = 'user-source-icon'
    const testis2FAId = 'user-checkbox-is2FA';
    const testisVerifiedId = 'user-checkbox-isVerified';
    const testisLockedId = 'user-checkbox-isLocked'
    const testChipId = 'user-label-chip';
    const testOkButtonId = 'user-ok-button';

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();

    expectValue(fixture, testNameId, user1.name);
    findEl(fixture, testSourceId);//icon must exist

    expectCheckValue(fixture, testis2FAId, true);
    expectCheckValue(fixture, testisVerifiedId, true);
    expectCheckValue(fixture, testisLockedId, true);

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

    //set isLocked
    setCheckValue(fixture, testisLockedId, true);
    fixture.detectChanges();
    expect(user1.isLocked).toBeTrue();
    //find labelds
    const labels = findEls(fixture, testChipId)
    expect(labels.length).toBe(1);

    const el2FA = findEl(fixture, testis2FAId);

    const accordionLoginMethod = 'user-login-method-accordion';
    const loginMethodAccordion = findEl(fixture, accordionLoginMethod, false);
    expect(loginMethodAccordion).toBeTruthy();

    //click(fixture, accordionLoginMethod);
    //component.getSensitiveData();
    user1.apiKey = { key: 'akey' };
    user1.cert = { publicCrt: 'acrt' };
    user1.isLoginMethodsExpanded = true;
    component.user = user1;
    fixture.detectChanges();
    tick(100);
    const apikey = getValue(fixture, 'user-apikey-input')
    expect(apikey).toEqual('akey');
    const crt = getValue(fixture, 'user-cert-pem-input')
    expect(crt).toEqual('acrt');

    setFieldValue(fixture, 'user-resetpass-password-input', 'testDeneme12')
    dispatchFakeEvent(findEl(fixture, 'user-resetpass-password-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.resetPasswordForm.invalid).toBeTrue();
    expect(component.resetPassword.password).toBeTruthy();
    expect(component.resetPassword.passwordAgain).toBeFalsy();

    setFieldValue(fixture, 'user-resetpass-password-again-input', 'testDeneme12')
    dispatchFakeEvent(findEl(fixture, 'user-resetpass-password-again-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.resetPasswordForm.valid).toBeTrue();
    expect(component.resetPassword.password).toBeTruthy();
    expect(component.resetPassword.passwordAgain).toBeTruthy();

  }));
});
