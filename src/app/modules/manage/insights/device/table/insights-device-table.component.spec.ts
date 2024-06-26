import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { findEl, getText } from 'src/app/modules/shared/helper.spec';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InsightsDeviceTableComponent } from './insights-device-table.component';

describe('InsightsActivitiyTableComponent', () => {
  let component: InsightsDeviceTableComponent;
  let fixture: ComponentFixture<InsightsDeviceTableComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsDeviceTableComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,
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
    fixture = TestBed.createComponent(InsightsDeviceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.dataSource = [
      {
        insertDate: new Date().toISOString(),
        insertDateStr: 'testdate',
        clientSha256: '',
        clientVersion: 'adfa',
        hasAntivirus: true,
        hasEncryptedDisc: false,
        hasFirewall: true,
        hostname: 'ferr',
        id: '123',
        isHealthy: true,
        macs: 'ops',
        osName: 'ad',
        osVersion: 'adfa',
        platform: 'win32',
        serial: 'asdfaf',
        userId: 'asdfafa',
        username: 'adfasdfawe',
      }];
    tick(1000);
    fixture.detectChanges();
    findEl(fixture, 'insights-device-table-header');
    findEl(fixture, 'insights-device-table-row');
    const value = getText(fixture, 'insights-device-table-row-date');
    expect(value.trim()).toBe('testdate');

    const username = getText(fixture, 'insights-device-table-row-username');

    expect(username.trim()).toBe('adfasdfawe');

  }));

});

