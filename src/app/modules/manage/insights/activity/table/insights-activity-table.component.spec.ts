import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
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
import { InsightsActivityTableComponent } from './insights-activity-table.component';

describe('InsightsActivitiyTableComponent', () => {
  let component: InsightsActivityTableComponent;
  let fixture: ComponentFixture<InsightsActivityTableComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsActivityTableComponent],
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
    fixture = TestBed.createComponent(InsightsActivityTableComponent);
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
        insertDate: new Date(2021, 1.2).toISOString(),
        insertDateStr: 'testdate',
        authSource: 'activedirectory',
        ip: '1.2.3.5',
        requestId: '1234567',
        status: 401,
        statusMessage: 'ERRAUTH',
        type: 'login 2fa',
        sessionId: 's1',
        username: 'abc@def',
        is2FA: true
      }];
    fixture.detectChanges();
    findEl(fixture, 'insights-activity-table-header');
    findEl(fixture, 'insights-activity-table-row');
    //const dateEl = findEl(fixture, 'insights-activity-table-row-date');
    const value = getText(fixture, 'insights-activity-table-row-date');
    expect(value.trim()).toBe('testdate');

    const username = getText(fixture, 'insights-activity-table-row-username');

    expect(username.trim()).toBe('abc@def');

  }));

});

