import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldValue } from '../helper.spec';
import { Gateway, Network } from '../models/network';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { GatewayComponent } from './gateway.component';

describe('GatewayComponent', () => {
  let component: GatewayComponent;
  let fixture: ComponentFixture<GatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewayComponent],
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
    fixture = TestBed.createComponent(GatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {

    expect(component).toBeTruthy();
    let gateway: Gateway = {
      id: '12123',
      name: 'test',
      labels: ['testlabel', 'testlabel2'],
      isEnabled: true,
      networkId: '22',

    }
    let network1: Network = {
      id: '22',
      name: 'testnetwork',
      labels: [], clientNetwork: '', serviceNetwork: ''
    }
    component.networks = [network1];
    component.gateway = gateway;
    component.gateway.networkName = network1.name;
    component.gateway.isEnabled = true;
    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'gateway-id-input', gateway.id);
    expectValue(fixture, 'gateway-name-input', gateway.name);
    expectValue(fixture, 'gateway-id-input', gateway.id);
    const chips = findEls(fixture, 'gateway-label-chip')
    expect(chips.length).toBe(2);
    //these codes are not working as expected
    //expectValue(fixture, 'gateway-input-network', network1.name);

    //const { nativeElement } = queryByCss(fixture, '[test-id=gateway-checkbox-enabled] input');
    //expect(nativeElement.checked).toBe(true);

    expect(component.gateway.isChanged).toBe(false);
    const button = findEl(fixture, 'gateway-ok-button', false);
    expect(button).toBeFalsy();

    setFieldValue(fixture, 'gateway-name-input', 'anewvalue');
    dispatchFakeEvent(findEl(fixture, 'gateway-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.gateway.name).toBe('anewvalue');
    expect(component.gateway.isChanged).toBe(true);
    const button2 = findEl(fixture, 'gateway-ok-button', false);
    expect(button2).toBeTruthy();

  }));

});
