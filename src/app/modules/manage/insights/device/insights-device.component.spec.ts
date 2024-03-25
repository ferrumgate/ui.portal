import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { of } from 'rxjs';
import { DeviceService } from 'src/app/modules/shared/services/device.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InsightsDeviceComponent } from './insights-device.component';

describe('InsightsDeviceComponent', () => {
  let component: InsightsDeviceComponent;
  let fixture: ComponentFixture<InsightsDeviceComponent>;
  let httpClient: HttpClient;
  let activitySpy = jasmine.createSpyObj('DeviceService', ['get']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsDeviceComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: DeviceService, useValue: activitySpy },
        TranslationService,
        NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(InsightsDeviceComponent);
    component = fixture.componentInstance;
    activitySpy.get.and.returnValue(of({ total: 0, items: [] }));

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let item = {
      total: 1, items: [
        {
          insertDate: new Date().toISOString(),
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
        }
      ]
    };
    activitySpy.get.and.returnValue(of(item));
    component.search();
    tick(1000);
    fixture.detectChanges();

    expect(component.totalLogs).toBe(1);

  }));
});
