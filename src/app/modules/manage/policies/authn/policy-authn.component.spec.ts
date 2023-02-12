import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { map, of } from 'rxjs';
import { findEl, findEls } from 'src/app/modules/shared/helper.spec';
import { AuthenticationPolicy, AuthenticationRule } from 'src/app/modules/shared/models/authnPolicy';
import { AuthorizationPolicy } from 'src/app/modules/shared/models/authzPolicy';
import { Group } from 'src/app/modules/shared/models/group';
import { Network } from 'src/app/modules/shared/models/network';
import { Service } from 'src/app/modules/shared/models/service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';



import { PolicyAuthnComponent } from './policy-authn.component';

describe('PolicyAuthnComponent', () => {
  let component: PolicyAuthnComponent;
  let fixture: ComponentFixture<PolicyAuthnComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthnComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,
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
    fixture = TestBed.createComponent(PolicyAuthnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let requestCounter = 0;


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




    const rule1: AuthenticationRule = {
      id: 'somid1', isEnabled: true, name: 'mysql', action: 'allow',
      networkId: network.id, profile: { is2FA: true, },
      userOrgroupIds: [group.id], isExpanded: true,
    }
    const rule2: AuthenticationRule = {
      id: 'somid2', isEnabled: true, name: 'prod', action: 'deny',
      networkId: network.id, profile: { is2FA: true, },
      userOrgroupIds: [group.id], isExpanded: true,
    }
    const rule3: AuthenticationRule = {
      id: 'somid3', isEnabled: true, name: 'mysql prod', action: 'allow',
      networkId: network2.id, profile: { is2FA: true, },
      userOrgroupIds: [group.id], isExpanded: true
    }
    let policy: AuthenticationPolicy = {


      rules: [rule1, rule2, rule3],
      rulesOrder: [rule1.id, rule2.id, rule3.id]
    }

    spyOn(httpClient, 'get').and.returnValues(
      of({ items: networks }),

      of({ items: groups }),
      of({ items: [] }),
      of(policy)
    )
    //load data 
    component.getAllData().subscribe();
    tick(1000);
    fixture.detectChanges();

    const policies = findEls(fixture, 'policy-authn-policy');
    expect(policies.length).toEqual(2);
    const serviceElements = findEls(fixture, 'policy-authn-rule');
    expect(serviceElements.length).toBe(3);

    component.searchKey = 'mysql';
    component.search();
    tick(1000);
    fixture.detectChanges();
    const serviceElements2 = findEls(fixture, 'policy-authn-rule');
    expect(serviceElements2.length).toBe(2);
    flush();




  }));
});
