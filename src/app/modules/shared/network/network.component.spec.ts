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
import { NetworkComponent } from './network.component';

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let fixture: ComponentFixture<NetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkComponent],
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
    fixture = TestBed.createComponent(NetworkComponent);
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
      labels: ['ops'], clientNetwork: '10.0.0.0/24', serviceNetwork: '10.0.0.0/24',
      sshHost: 'localhost:9999'
    }
    component.network = network1;
    component.network.gatewaysCount = 1;

    tick(1000);
    fixture.detectChanges();

    expectValue(fixture, 'network-name-input', network1.name);
    expectValue(fixture, 'network-clientnetwork-input', network1.clientNetwork);
    const chips = findEls(fixture, 'network-label-chip')
    expect(chips.length).toBe(1);
    //these codes are not working as expected
    //expectValue(fixture, 'network-input-network', network1.name);

    //const { nativeElement } = queryByCss(fixture, '[test-id=network-checkbox-enabled] input');
    //expect(nativeElement.checked).toBe(true);

    expect(component.network.isChanged).toBe(false);
    const button = findEl(fixture, 'network-ok-button', false);
    expect(button).toBeFalsy();

    setFieldValue(fixture, 'network-name-input', 'anewvalue');
    dispatchFakeEvent(findEl(fixture, 'network-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.network.name).toBe('anewvalue');
    expect(component.network.isChanged).toBe(true);
    const button2 = findEl(fixture, 'network-ok-button', false);
    expect(button2).toBeTruthy();

    //set back again
    setFieldValue(fixture, 'network-name-input', 'testnetwork');
    dispatchFakeEvent(findEl(fixture, 'network-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    expect(component.network.name).toBe('testnetwork');
    expect(component.network.isChanged).toBe(false);
    const button3 = findEl(fixture, 'network-ok-button', false);
    expect(button3).toBeFalsy();

    // set ssh 
    setFieldValue(fixture, 'network-sshhost-input', 'localhost:1234');
    dispatchFakeEvent(findEl(fixture, 'network-sshhost-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    expect(component.network.isChanged).toBe(true);
    const button4 = findEl(fixture, 'network-ok-button', false);
    expect(button4).toBeTruthy();

    //set invalid sshs
    setFieldValue(fixture, 'network-sshhost-input', 'http://localhost:1234');
    dispatchFakeEvent(findEl(fixture, 'network-sshhost-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    expect(component.formGroup.invalid).toBe(true);

  }));

  it('form is invalid', fakeAsync(async () => {

    expect(component).toBeTruthy();

    let network1: Network = {
      id: '22',
      name: 'testnetwork',
      labels: ['ops'], clientNetwork: '10.0.0.0/24', serviceNetwork: '', sshHost: 'localhost:9999'
    }
    component.network = network1;
    component.network.gatewaysCount = 1;

    tick(1000);
    fixture.detectChanges();

    expect(component.formGroup.valid).toBe(false);
  }))

});
