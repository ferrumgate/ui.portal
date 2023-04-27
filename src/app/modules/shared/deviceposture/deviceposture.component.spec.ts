import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';

import { DevicePostureComponent } from './deviceposture.component';
import { SharedModule } from '../shared.module';
import { TranslationService } from '../services/translation.service';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { DevicePosture } from '../models/device';
import { dispatchFakeEvent, expectValue, findEl, findEls } from '../helper.spec';


describe('DevicePostureComponent', () => {
  let component: DevicePostureComponent;
  let fixture: ComponentFixture<DevicePostureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevicePostureComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePostureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding and error check', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: DevicePosture = {

      id: 'p1',
      name: "window 10",
      isEnabled: true,
      labels: ['ab'],
      os: 'win32',
      insertDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      osVersions: [{ name: 'window10' }],
      antivirusList: [{ name: 'general' }],
      clientVersions: [{ version: '1.2.3' }],
      discEncryption: true,
      filePathList: [{ path: 'adaf' }],
      firewallList: [{ name: 'asdfadf' }],
      macList: [{ value: 'adfaf' }],
      processList: [{ path: 'adfafda' }],
      registryList: [{ path: 'adfa', key: 'adfa' }],
      serialList: [{ value: 'adfa' }]

    }
    component.model = model;



    tick(100);
    fixture.detectChanges();
    await fixture.whenStable();

    const nameinput = 'deviceposture-name-input';
    expectValue(fixture, nameinput, 'window 10');


    const labels = 'deviceposture-label-chip';
    const labelEls = findEls(fixture, labels);
    expect(labelEls.length > 0).toBeTrue;

    expectValue(fixture, 'deviceposture-clientversion-input', '1.2.3');
    expectValue(fixture, 'deviceposture-mac-input', 'adfaf');
    expectValue(fixture, 'deviceposture-serial-input', 'adfa');
    expectValue(fixture, 'deviceposture-filepath-input', 'adaf');
    expectValue(fixture, 'deviceposture-process-input', 'adfafda');
    expectValue(fixture, 'deviceposture-registry-input', 'adfa');

    const antivirusEls = findEls(fixture, 'deviceposture-antivirus-input');
    expect(antivirusEls.length > 0).toBeTrue;

    const firewallEls = findEls(fixture, 'deviceposture-firewall-input');
    expect(firewallEls.length > 0).toBeTrue;

    const discEncryptionEls = findEls(fixture, 'deviceposture-discencryption-input');
    expect(discEncryptionEls.length > 0).toBeTrue;



  }))

});
