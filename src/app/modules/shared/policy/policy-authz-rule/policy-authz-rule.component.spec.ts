import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldValue } from '../../helper.spec';
import { Group } from '../../models/group';
import { Network } from '../../models/network';
import { Service } from '../../models/service';
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
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let group: Group = {
      id: 'groupid', name: 'north', labels: ['test'], isEnabled: true,
    }
    const groups = [group];

    let network: Network = {
      id: 'network1', name: 'networkname'
    } as Network;

    let network2: Network = {
      id: 'network12', name: 'networkname2'
    } as Network;

    const networks = [network, network2];

    let service: Service = {
      id: 'sv1', name: 'mysql-dev', labels: ['test'], isEnabled: true,
      hosts: [{ host: '10.0.0.1' }],
      networkId: 'network1', protocol: 'raw',
      ports: [{ port: 80, isTcp: true }, { port: 9090, isUdp: true }],
      assignedIp: '',
      count: 1
    }

    const services = [service];
    const rule = {
      id: 'somid', isEnabled: true, name: 'mysql prod', networkId: network.id, serviceId: service.id, profile: { is2FA: true }, userOrgroupIds: [group.id], isExpanded: true, serviceName: ''
    }

    component.users = [];
    component.groups = groups;
    component.networks = networks;
    component.services = services;
    component.rule = rule

    tick(1000);
    fixture.detectChanges();
    const testAccordionId = 'policy-authz-rule-accordion';
    findEl(fixture, testAccordionId);

    const testTitleId = 'policy-authz-rule-title';
    findEl(fixture, testTitleId);

    expect(component.formGroup.valid).toBeTrue();

    const testNameId = 'policy-authz-rule-name-input';
    expectValue(fixture, testNameId, rule.name);

    const testServiceId = 'policy-authz-rule-service-input';
    expectValue(fixture, testServiceId, rule.serviceName);

    const testUserOrGroupChips = 'policy-authz-rule-label-chip';
    const chips = findEls(fixture, testUserOrGroupChips);
    expect(chips.length).toEqual(1);

    const test2FAId = 'policy-authz-rule-checkbox-2fa';
    findEl(fixture, test2FAId);

    const testEnabledId = 'policy-authz-rule-checkbox-enabled';
    findEl(fixture, testEnabledId);

    const testOkButtonId = 'policy-authz-rule-ok-button';

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
    expect(component.rule.isChanged).toBeTrue;

  }));
});

