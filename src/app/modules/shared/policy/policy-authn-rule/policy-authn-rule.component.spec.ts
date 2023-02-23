import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness } from '@angular/material/tabs/testing'
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTabGroup } from '@angular/material/tabs';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { GroupComponent } from '../../group/group.component';
import { dispatchFakeEvent, expectValue, findEl, findEls, getCheckValue, queryAllByCss, queryByCss, setFieldValue } from '../../helper.spec';
import { AuthenticationPolicy, AuthenticationRule } from '../../models/authnPolicy';
import { Group } from '../../models/group';
import { Network } from '../../models/network';
import { Service } from '../../models/service';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { GroupService } from '../../services/group.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';




import { PolicyAuthnRuleComponent } from './policy-authn-rule.component';
import { By } from '@angular/platform-browser';
import { UtilService } from '../../services/util.service';

describe('PolicyAuthnRuleComponent', () => {
  let component: PolicyAuthnRuleComponent;
  let fixture: ComponentFixture<PolicyAuthnRuleComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthnRuleComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module,
        MatIconTestingModule, RouterTestingModule.withRoutes([])],
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
    fixture = TestBed.createComponent(PolicyAuthnRuleComponent);
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

  const countries = [
    {
      "id": "Bangladesh",
      "isoCode": "BD",
      "name": "Bangladesh"
    },
    {
      "id": "Belgium",
      "isoCode": "BE",
      "name": "Belgium"
    },
    {
      "id": "Burkina_Faso",
      "isoCode": "BF",
      "name": "Burkina Faso"
    }
  ];
  it('data binding first tab', fakeAsync(async () => {
    expect(component).toBeTruthy();


    const rule: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: { is2FA: true, ips: [{ ip: '1.2.3.4' }] },
      userOrgroupIds: [group.id], isExpanded: true,
      action: 'allow'

    }

    component.users = [];
    component.groups = groups;
    component.networks = networks;
    component.countryList = countries;

    component.rule = rule

    tick(1000);
    fixture.detectChanges();
    const testAccordionId = 'policy-authn-rule-accordion';
    findEl(fixture, testAccordionId);

    const testTitleId = 'policy-authn-rule-title';
    findEl(fixture, testTitleId);

    expect(component.formGroup.valid).toBeTrue();

    const testNameId = 'policy-authn-rule-name-input';
    expectValue(fixture, testNameId, rule.name);

    const testExplanation = 'policy-authn-rule-explanation';
    findEl(fixture, testExplanation);

    const testUserOrGroupChips = 'policy-authn-rule-label-chip';
    const chips = findEls(fixture, testUserOrGroupChips);
    expect(chips.length).toEqual(1);

    const test2FAId = 'policy-authn-rule-checkbox-2fa';
    findEl(fixture, test2FAId);

    const testEnabledId = 'policy-authn-rule-checkbox-enabled';
    findEl(fixture, testEnabledId);

    const testActionId = 'policy-auth-rule-toogle-action';
    findEl(fixture, testActionId);

    const testIpsTabId = 'policy-authn-tab-ips';

    const testIpsId = 'policy-authn-rule-ip-chip';

    const testOkButtonId = 'policy-authn-rule-ok-button';

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

  it('data binding second tab first ipIntelligence null', fakeAsync(async () => {
    expect(component).toBeTruthy();


    //component.tabs.selectedIndex = 1;
    component.selectedTab = 1;
    tick(1000);
    fixture.detectChanges();



    const rule: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: {
        is2FA: true, ips: [{ ip: '1.2.3.4' }],
      },

      userOrgroupIds: [group.id], isExpanded: true,

      action: 'allow'

    }

    component.users = [];
    component.groups = groups;
    component.networks = networks;
    component.countryList = countries;

    component.rule = rule

    tick(1000);
    fixture.detectChanges();

    await fixture.whenStable();

    const ipTab = findEl(fixture, 'policy-authn-tab-ips', false)

    expect(ipTab).toBeTruthy();

    const isWhiteListEl = getCheckValue(fixture, 'policy-authn-rule-ip-iswhitelist-enabled')
    expect(isWhiteListEl).toBeFalse();

    const isBlackListEl = getCheckValue(fixture, 'policy-authn-rule-ip-isblacklist-enabled')
    expect(isBlackListEl).toBeFalse();


    const isProxyEl = getCheckValue(fixture, 'policy-authn-rule-ip-isproxy-enabled')
    expect(isProxyEl).toBeFalse();

    const isHostingEl = getCheckValue(fixture, 'policy-authn-rule-ip-ishosting-enabled')
    expect(isHostingEl).toBeFalse();

    const isCrawlerEl = getCheckValue(fixture, 'policy-authn-rule-ip-iscrawler-enabled')
    expect(isCrawlerEl).toBeFalse();

    const selectedCountryList = findEls(fixture, 'policy-authn-rule-ip-country');
    expect(selectedCountryList.length).toEqual(0);


  }));

  it('data binding second tab first ipIntelligence not null', fakeAsync(async () => {
    expect(component).toBeTruthy();


    //component.tabs.selectedIndex = 1;
    component.selectedTab = 1;
    tick(1000);
    fixture.detectChanges();


    const rule2: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: {
        is2FA: true, ips: [{ ip: '1.2.3.4' }],
        ipIntelligence: {
          isBlackList: true, isCrawler: true, isHosting: true, isProxy: true, isWhiteList: true
        }
      },
      userOrgroupIds: [group.id], isExpanded: true,


      action: 'allow'

    }

    component.users = [];
    component.groups = groups;
    component.networks = networks;
    component.countryList = countries;

    component.rule = rule2





    tick(1000);
    fixture.detectChanges();
    await fixture.whenStable();



    const isWhiteListEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-iswhitelist-enabled')
    expect(isWhiteListEl2).toBeTrue();

    const isBlackListEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-isblacklist-enabled')
    expect(isBlackListEl2).toBeTrue();


    const isProxyEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-isproxy-enabled')
    expect(isProxyEl2).toBeTrue();

    const isHostingEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-ishosting-enabled')
    expect(isHostingEl2).toBeTrue();

    const isCrawlerEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-iscrawler-enabled')
    expect(isCrawlerEl2).toBeTrue();


    const testOkButtonId = 'policy-authn-rule-ok-button';



  }));


  it('data binding second tab first country list', fakeAsync(async () => {
    expect(component).toBeTruthy();


    //component.tabs.selectedIndex = 1;
    component.selectedTab = 1;

    tick(1000);
    fixture.detectChanges();
    const rule2: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: {
        is2FA: true, ips: [{ ip: '1.2.3.4' }],
        ipIntelligence: {
          isBlackList: true, isCrawler: true, isHosting: true, isProxy: true, isWhiteList: true
        }, locations: [
          { country: countries[1].isoCode }
        ]
      },
      userOrgroupIds: [group.id], isExpanded: true,


      action: 'allow'

    }

    component.users = [];
    component.groups = groups;
    component.networks = networks;
    component.countryList = countries;
    component.rule = rule2

    tick(1000);
    fixture.detectChanges();
    await fixture.whenStable();

    //debugger;
    //const selectedCountryList = findEls(fixture, 'policy-authn-rule-ip-country-options');
    //expect(selectedCountryList.length).toEqual(1);
    expect(component.countryMultiCtrl.value.length).toEqual(1);


  }));


});

