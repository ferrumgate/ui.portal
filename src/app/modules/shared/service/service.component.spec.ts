import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { checkField, dispatchFakeEvent, expectCheckValue, expectText, expectValue, findEl, findEls, queryByCss, setFieldValue } from '../helper.spec';
import { Group } from '../models/group';
import { Gateway, Network } from '../models/network';
import { Service } from '../models/service';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';


import { ServiceComponent } from './service.component';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceComponent],
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
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let network: Network = {
      id: 'network1', name: 'networkname'
    } as Network;
    let service: Service = {
      id: 'sv1', name: 'mysql-dev', labels: ['test'], isEnabled: true,
      host: '10.0.0.1', networkId: 'network1', protocol: 'raw', tcp: 80, udp: 9090, assignedIp: ''
    }
    component.networks = [network];
    component.service = service;
    tick(1000);
    fixture.detectChanges();
    const testNameId = 'service-name-input';
    const testHostId = 'service-host-input';
    const testTcpId = 'service-tcp-input';
    const testUdpId = 'service-udp-input';
    //const testNetworkId = 'service-network-input';
    const testChipId = 'service-label-chip';
    const testEnabledId = 'service-checkbox-enabled';
    const testOkButtonId = 'service-ok-button';

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();

    expectValue(fixture, testNameId, service.name);
    expectValue(fixture, testHostId, service.host);
    expectValue(fixture, testTcpId, '80');
    expectValue(fixture, testUdpId, '9090');
    //expectValue(fixture, testNetworkId, network.name);

    //expectCheckValue(fixture, testEnabledId, true);
    const chips = findEls(fixture, testChipId)
    expect(chips.length).toBe(1);

    setFieldValue(fixture, testNameId, '')
    dispatchFakeEvent(findEl(fixture, testNameId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();
    expect(component.formError.name).toBeTruthy();
    const button = findEl(fixture, testOkButtonId, false);
    expect(button).toBeUndefined;


  }));
});

