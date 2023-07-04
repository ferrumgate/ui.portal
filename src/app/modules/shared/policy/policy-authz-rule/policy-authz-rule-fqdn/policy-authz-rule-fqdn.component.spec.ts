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

import { click, dispatchFakeEvent, expectValue, findEl, findEls, getCheckValue, queryAllByCss, queryByCss, setFieldValue } from '../../../helper.spec';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../../shared.module';
import { ConfigService } from '../../../services/config.service';
import { TranslationService } from '../../../services/translation.service';
import { NotificationService } from '../../../services/notification.service';
import { PolicyAuthzRuleFqdnComponent } from './policy-authz-rule-fqdn.component';
import { CaptchaService } from '../../../services/captcha.service';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group';
import { Network } from '../../../models/network';
import { FqdnIntelligenceProfile } from '../../../models/authzProfile';
import { FqdnIntelligenceCategory, FqdnIntelligenceList } from '../../../models/fqdnIntelligence';
import { UtilService } from '../../../services/util.service';



describe('PolicyAuthzRuleFqdnComponent', () => {
  let component: PolicyAuthzRuleFqdnComponent;
  let fixture: ComponentFixture<PolicyAuthzRuleFqdnComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthzRuleFqdnComponent],
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
    fixture = TestBed.createComponent(PolicyAuthzRuleFqdnComponent);
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
  const fqdnListA: FqdnIntelligenceList = {
    id: UtilService.randomNumberString(), name: "global list", insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
  };
  const fqdnListB: FqdnIntelligenceList =
  {
    id: UtilService.randomNumberString(), name: "talos list", insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
  };
  const fqdnListC: FqdnIntelligenceList =
  {
    id: UtilService.randomNumberString(), name: "frog list", insertDate: new Date().toISOString(), updateDate: new Date().toISOString()
  };
  const fqdnLists: FqdnIntelligenceList[] = [

    fqdnListA, fqdnListB, fqdnListC
  ];
  const profile: FqdnIntelligenceProfile =
  {
    blackFqdns: [{ fqdn: 'testa' }],
    blackLists: [fqdnListA.id],
    ignoreFqdns: [{ fqdn: 'testb' }],
    ignoreLists: [fqdnListB.id],
    whiteFqdns: [{ fqdn: 'testc' }],
    whiteLists: [fqdnListC.id]
  };
  const cat1: FqdnIntelligenceCategory = {
    id: UtilService.randomNumberString(),
    isVisible: true,
    name: 'Unknown'
  };
  const cat2: FqdnIntelligenceCategory = {
    id: UtilService.randomNumberString(),
    isVisible: false,
    name: 'BlackList'
  };



  it('data binding first tab', fakeAsync(async () => {
    expect(component).toBeTruthy();



    component.intelligenceCategoryList = [cat1, cat2];
    component.intelligenceList = [fqdnListA, fqdnListB, fqdnListC];
    component.model = profile;

    tick(1000);
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    //ignore fqdn list
    const testignoreFqdn = 'policy-authz-rule-fqdn-ignore-fqdn-chip';
    let ignoreFqndItems = findEls(fixture, testignoreFqdn);
    expect(ignoreFqndItems.length).toBe(1);

    const testignoreFqdnInput = 'policy-authz-rule-fqdn-ignore-fqdn-input';
    setFieldValue(fixture, testignoreFqdnInput, 'abcdef')
    dispatchFakeEvent(findEl(fixture, testignoreFqdnInput).nativeElement, 'blur');
    tick(1000);
    fixture.detectChanges();
    ignoreFqndItems = findEls(fixture, testignoreFqdn);
    expect(ignoreFqndItems.length).toBe(2);

    //ignore list

    const testignoreList = 'policy-authz-rule-fqdn-ignore-list-chip';
    let ignoreItems = findEls(fixture, testignoreList);
    expect(ignoreItems.length).toBe(1);


    //white fqdn list
    const testWhiteFqdn = 'policy-authz-rule-fqdn-white-fqdn-chip';
    let whiteFqdnItems = findEls(fixture, testWhiteFqdn);
    expect(whiteFqdnItems.length).toBe(1);

    const testWhiteFqdnInput = 'policy-authz-rule-fqdn-white-fqdn-input';
    setFieldValue(fixture, testWhiteFqdnInput, 'abcdef')
    dispatchFakeEvent(findEl(fixture, testWhiteFqdnInput).nativeElement, 'blur');
    tick(1000);
    fixture.detectChanges();
    whiteFqdnItems = findEls(fixture, testWhiteFqdn);
    expect(whiteFqdnItems.length).toBe(2);

    //white list

    const testWhiteList = 'policy-authz-rule-fqdn-white-list-chip';
    let whiteItems = findEls(fixture, testWhiteList);
    expect(whiteItems.length).toBe(1);


    //black fqdn list
    const testBlackFqdn = 'policy-authz-rule-fqdn-black-fqdn-chip';
    let blackFqdnItems = findEls(fixture, testBlackFqdn);
    expect(blackFqdnItems.length).toBe(1);

    const testBlackFqdnInput = 'policy-authz-rule-fqdn-black-fqdn-input';
    setFieldValue(fixture, testBlackFqdnInput, 'abcdef')
    dispatchFakeEvent(findEl(fixture, testBlackFqdnInput).nativeElement, 'blur');
    tick(1000);
    fixture.detectChanges();
    blackFqdnItems = findEls(fixture, testBlackFqdn);
    expect(blackFqdnItems.length).toBe(2);

    //black list

    const testBlackList = 'policy-authz-rule-fqdn-black-list-chip';
    let blackItems = findEls(fixture, testBlackList);
    expect(blackItems.length).toBe(1);






  }));


});

