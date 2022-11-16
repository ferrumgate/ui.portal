import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { map, of } from 'rxjs';
import { findEl, findEls } from 'src/app/modules/shared/helper.spec';
import { Group } from 'src/app/modules/shared/models/group';
import { AuditService } from 'src/app/modules/shared/services/audit.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { Network } from '../../../shared/models/network';
import { Service } from '../../../shared/models/service';
import { UtilService } from '../../../shared/services/util.service';



import { LogsAuditComponent } from './logs-audit.component';

describe('LogsAuditComponent', () => {
  let component: LogsAuditComponent;
  let fixture: ComponentFixture<LogsAuditComponent>;
  let httpClient: HttpClient;
  let auditSpy = jasmine.createSpyObj('AuditService', ['get']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsAuditComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuditService, useValue: auditSpy },
        TranslationService,
        NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(LogsAuditComponent);
    component = fixture.componentInstance;
    auditSpy.get.and.returnValue(of({ total: 0, items: [] }));

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
          position: 1, insertDate: new Date().toISOString(), username: 'abc',
          message: 'def', messageSummary: 'tttr', messageDetail: 'ops',
          severity: 'wanr', tags: 'asd', ip: '123', userId: 'sd'
        }
      ]
    };
    auditSpy.get.and.returnValue(of(item));
    component.search();
    tick(1000);
    fixture.detectChanges();

    expect(component.totalLogs).toBe(1);

  }));
});
