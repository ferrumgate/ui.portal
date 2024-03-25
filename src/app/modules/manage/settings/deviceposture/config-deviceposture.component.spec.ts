import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DevicePosture } from 'src/app/modules/shared/models/device';
import { ConfigDevicePostureComponent } from './config-deviceposture.component';

describe('ConfigDevicePostureComponent', () => {
  let component: ConfigDevicePostureComponent;
  let fixture: ComponentFixture<ConfigDevicePostureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigDevicePostureComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDevicePostureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
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
    component.postures = [model]
    tick(1000);
    fixture.detectChanges();
    const locals = findEls(fixture, 'config-deviceposture-item');
    expect(locals.length).toEqual(1);

  }));
});
