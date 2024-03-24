import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { map, of } from 'rxjs';
import { findEl, findEls, getValue, getText } from 'src/app/modules/shared/helper.spec';
import { Group } from 'src/app/modules/shared/models/group';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LogsAuditTableComponent } from './logs-audit-table.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';





describe('LogsAuditTableComponent', () => {
  let component: LogsAuditTableComponent;
  let fixture: ComponentFixture<LogsAuditTableComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsAuditTableComponent],
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
    fixture = TestBed.createComponent(LogsAuditTableComponent);
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
        position: 1, insertDateStr: 'abd', insertDate: 'ad', username: 'abc',
        message: 'def', messageSummary: 'tttr', messageDetail: 'ops',
        severity: 'wanr', tags: 'asd', ip: '123', userId: 'sd'
      }];
    fixture.detectChanges();
    findEl(fixture, 'logs-audit-table-header');
    findEl(fixture, 'logs-audit-table-row');
    const dateEl = findEl(fixture, 'logs-audit-table-row-date');
    const value = getText(fixture, 'logs-audit-table-row-date');
    expect(value.trim()).toBe('abd');

    const username = getText(fixture, 'logs-audit-table-row-username');

    expect(username.trim()).toBe('abc');



  }));


});


