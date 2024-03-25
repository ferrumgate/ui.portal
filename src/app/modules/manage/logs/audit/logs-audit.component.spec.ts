import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AuditService } from 'src/app/modules/shared/services/audit.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LogsAuditComponent } from './logs-audit.component';

describe('LogsAuditComponent', () => {
  let component: LogsAuditComponent;
  let fixture: ComponentFixture<LogsAuditComponent>;
  let httpClient: HttpClient;
  let auditSpy = jasmine.createSpyObj('AuditService', ['get']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsAuditComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
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
