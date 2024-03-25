import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { AuthorizationPolicy } from 'src/app/modules/shared/models/authzPolicy';
import { Group } from 'src/app/modules/shared/models/group';
import { Network } from 'src/app/modules/shared/models/network';
import { Service } from 'src/app/modules/shared/models/service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PolicyAuthzComponent } from './policy-authz.component';

describe('PolicyAuthzComponent', () => {
  let component: PolicyAuthzComponent;
  let fixture: ComponentFixture<PolicyAuthzComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthzComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
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
    fixture = TestBed.createComponent(PolicyAuthzComponent);
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

    let service: Service = {
      id: 'sv1', name: 'mysql-dev', labels: ['test'], isEnabled: true,
      networkId: 'network1', protocol: 'raw', assignedIp: '',
      count: 1, hosts: [{ host: '10.0.0.1' }], ports: [{ port: 80, isTcp: true }, { port: 9090, isUdp: true }]
    }

    const services = [service];
    const rule1 = {
      id: 'somid', isEnabled: true, name: 'mysql prod', networkId: network.id, serviceId: service.id, profile: { is2FA: true, }, userOrgroupIds: [group.id], isExpanded: true, serviceName: ''
    }
    const rule2 = {
      id: 'somid', isEnabled: true, name: 'mysql prod', networkId: network.id, serviceId: service.id, profile: { is2FA: true, }, userOrgroupIds: [group.id], isExpanded: true, serviceName: ''
    }
    const rule3 = {
      id: 'somid', isEnabled: true, name: 'mysql prod', networkId: network2.id, serviceId: service.id, profile: { is2FA: true, }, userOrgroupIds: [group.id], isExpanded: true, serviceName: ''
    }
    let policy: AuthorizationPolicy = {
      rules: [rule1, rule2, rule3],
      rulesOrder: [rule1.id, rule2.id, rule3.id]
    }

    spyOn(httpClient, 'get').and.returnValues(
      of({ items: networks }),
      of({ items: [] }),
      of({ items: [] }),
      of({ items: services }),
      of({ items: groups }),
      of({ items: [] }),
      of(policy)
    )
    //load data 
    component.getAllData().subscribe();
    tick(1000);
    fixture.detectChanges();

    const policies = findEls(fixture, 'policy-authz-policy');
    expect(policies.length).toEqual(2);
    const serviceElements = findEls(fixture, 'policy-authz-rule');
    expect(serviceElements.length).toBe(3);
    flush();

  }));
});
