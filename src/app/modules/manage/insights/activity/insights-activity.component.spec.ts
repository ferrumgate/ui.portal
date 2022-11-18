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
import { ActivityService } from 'src/app/modules/shared/services/activity.service';
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



import { InsightsActivityComponent } from './insights-activity.component';

describe('InsightsActivityComponent', () => {
  let component: InsightsActivityComponent;
  let fixture: ComponentFixture<InsightsActivityComponent>;
  let httpClient: HttpClient;
  let activitySpy = jasmine.createSpyObj('ActivityService', ['get']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsActivityComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivityService, useValue: activitySpy },
        TranslationService,
        NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(InsightsActivityComponent);
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
