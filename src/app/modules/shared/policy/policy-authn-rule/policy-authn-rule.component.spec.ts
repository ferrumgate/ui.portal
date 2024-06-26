import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { click, dispatchFakeEvent, expectValue, findEl, findEls, getCheckValue, setFieldValue } from '../../helper.spec';
import { AuthenticationRule } from '../../models/authnPolicy';
import { Group } from '../../models/group';
import { Network } from '../../models/network';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { GroupService } from '../../services/group.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';
import { IpIntelligenceList } from '../../models/ipIntelligence';
import { UtilService } from '../../services/util.service';
import { PolicyAuthnRuleComponent } from './policy-authn-rule.component';

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
  const ipLists: IpIntelligenceList[] = [
    {
      id: UtilService.randomNumberString(), name: "global list", insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
    },
    {
      id: UtilService.randomNumberString(), name: "talos list", insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
    },

  ]
  it('data binding first tab', fakeAsync(async () => {
    expect(component).toBeTruthy();

    const rule: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: { is2FA: true, whiteListIps: [{ ip: '1.2.3.4' }] },
      userOrgroupIds: [group.id], isExpanded: true,

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
        is2FA: true, whiteListIps: [{ ip: '1.2.3.4' }],
        blackListIps: [{ ip: '1.2.3.5' }, { ip: '1.2.3.6' }],
      },

      userOrgroupIds: [group.id], isExpanded: true,

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

    const customWhiteList = findEls(fixture, 'policy-authn-rule-whitelist-chip');
    expect(customWhiteList.length).toEqual(1);

    const customBlackList = findEls(fixture, 'policy-authn-rule-blacklist-chip');
    expect(customBlackList.length).toEqual(2);

    const ipIntelligenceWhiteList = findEls(fixture, 'policy-authn-rule-intel-whitelist-chip');
    expect(ipIntelligenceWhiteList.length).toEqual(0);

    const ipIntelligenceBlackList = findEls(fixture, 'policy-authn-rule-intel-blacklist-chip');
    expect(ipIntelligenceBlackList.length).toEqual(0);

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
        is2FA: true, whiteListIps: [{ ip: '1.2.3.4' }], blackListIps: [{ ip: '1.2.3.5' }, { ip: '1.2.3.6' }],
        ipIntelligence: {
          isCrawler: true, isHosting: true, isProxy: true, blackLists: [ipLists[0].id],
          whiteLists: [ipLists[0].id, ipLists[1].id],

        }
      },
      userOrgroupIds: [group.id], isExpanded: true,

    }

    component.users = [];
    component.groups = groups;
    component.networks = networks;
    component.countryList = countries;
    component.ipIntelligenceLists = ipLists;

    component.rule = rule2

    tick(1000);
    fixture.detectChanges();
    await fixture.whenStable();

    const customWhiteList = findEls(fixture, 'policy-authn-rule-whitelist-chip');
    expect(customWhiteList.length).toEqual(1);

    const customBlackList = findEls(fixture, 'policy-authn-rule-blacklist-chip');
    expect(customBlackList.length).toEqual(2);

    const ipIntelligenceWhiteList = findEls(fixture, 'policy-authn-rule-intel-whitelist-chip');
    expect(ipIntelligenceWhiteList.length).toEqual(2);

    const ipIntelligenceBlackList = findEls(fixture, 'policy-authn-rule-intel-blacklist-chip');
    expect(ipIntelligenceBlackList.length).toEqual(1);

    const isProxyEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-isproxy-enabled')
    expect(isProxyEl2).toBeTrue();

    const isHostingEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-ishosting-enabled')
    expect(isHostingEl2).toBeTrue();

    const isCrawlerEl2 = getCheckValue(fixture, 'policy-authn-rule-ip-iscrawler-enabled')
    expect(isCrawlerEl2).toBeTrue();

    const testOkButtonId = 'policy-authn-rule-ok-button';

  }));

  it('data binding country list', fakeAsync(async () => {
    expect(component).toBeTruthy();

    //component.tabs.selectedIndex = 1;
    component.selectedTab = 1;

    tick(1000);
    fixture.detectChanges();
    const rule2: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: {
        is2FA: true, whiteListIps: [{ ip: '1.2.3.4' }],
        ipIntelligence: {
          isCrawler: true, isHosting: true, isProxy: true, blackLists: [], whiteLists: []
        }, locations: [
          { countryCode: countries[1].isoCode }
        ]
      },
      userOrgroupIds: [group.id], isExpanded: true,

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

  it('data binding time tab', fakeAsync(async () => {
    expect(component).toBeTruthy();

    //component.tabs.selectedIndex = 1;
    component.selectedTab = 2;

    tick(1000);
    fixture.detectChanges();
    const rule2: AuthenticationRule = {
      id: 'somid', isEnabled: true, name: 'only north group can access',
      networkId: network.id,
      profile: {
        is2FA: true, whiteListIps: [{ ip: '1.2.3.4' }],
        ipIntelligence: {
          isCrawler: true, isHosting: true, isProxy: true, blackLists: [], whiteLists: []
        }, locations: [
          { countryCode: countries[1].isoCode }
        ],
        times: [
          { days: [0, 1, 2], timezone: 'Africa', endTime: 1200, startTime: 10 }
        ]
      },
      userOrgroupIds: [group.id], isExpanded: true,

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
    const selectedTimeProfiles = findEls(fixture, 'policy-authn-rule-time-chip');
    expect(selectedTimeProfiles.length).toEqual(1);

    const addUI = findEl(fixture, 'policy-authn-rule-time-add-ui', false);
    expect(addUI).toBeFalsy();

    // open add ui 
    click(fixture, 'policy-authn-rule-time-add-button');
    fixture.detectChanges();
    const addUI2 = findEl(fixture, 'policy-authn-rule-time-add-ui', false);
    expect(addUI2).toBeTruthy();

    // close add ui 
    click(fixture, 'policy-authn-rule-time-add-button');
    fixture.detectChanges();

    const addUI3 = findEl(fixture, 'policy-authn-rule-time-add-ui', false);
    expect(addUI3).toBeFalsy();

    //add new profile
    component.addTimeProfile({ days: [0, 1], timezone: 'Africa' });
    fixture.detectChanges();
    const selectedTimeProfiles2 = findEls(fixture, 'policy-authn-rule-time-chip');
    expect(selectedTimeProfiles2.length).toEqual(2);

  }));

});

