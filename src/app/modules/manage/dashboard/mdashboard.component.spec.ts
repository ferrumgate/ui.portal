import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MDashboardComponent } from './mdashboard.component';

describe('MDashboardComponent', () => {
  let component: MDashboardComponent;
  let fixture: ComponentFixture<MDashboardComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MDashboardComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
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
    fixture = TestBed.createComponent(MDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();

    spyOn(httpClient, 'get').and.returnValues(
      of({
        networkCount: 1,
        gatewayCount: 2,
        userCount: 3,
        groupCount: 4,
        serviceCount: 5,
        authnCount: 6,
        authzCount: 7
      }),
      of({
        sessionCount: 20,
        tunnelCount: 21
      }),
      of({
        total: 30,
        aggs: [

        ]
      }),
      of({
        total: 30,
        aggs: [

        ]
      }),
      of({
        total: 30,
        aggs: [

        ]
      }),
      of({
        total: 30,
        aggs: [

        ]
      }),
      of({
        total: 30,
        aggs: [

        ]
      })
    )

    //load data 
    component.getAllData().subscribe();
    tick(1000);
    fixture.detectChanges();

    const totalNetworkEl = findEls(fixture, 'mdashboard-status-totalnetwork');
    expect(totalNetworkEl.length).toBe(1);

    const totalSessionsEl = findEls(fixture, 'mdashboard-status-sessionscount');
    expect(totalSessionsEl.length).toBe(1);

    const loginTryEl = findEls(fixture, 'mdashboard-chart-logintry');
    expect(loginTryEl.length).toBe(1);

  }));
});
