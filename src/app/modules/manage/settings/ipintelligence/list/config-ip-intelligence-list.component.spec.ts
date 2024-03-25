import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { click, findEl, findEls } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigIpIntelligenceListComponent } from './config-ip-intelligence-list.component';

describe('ConfigIpIntelligenceListComponent', () => {
  let component: ConfigIpIntelligenceListComponent;
  let fixture: ComponentFixture<ConfigIpIntelligenceListComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigIpIntelligenceListComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        AuthenticationService,
        ConfigService,
        ConfigureService,
        NotificationService,
        TranslationService,
        ConfirmService,
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
    confirmService = TestBed.inject(ConfirmService);
    fixture = TestBed.createComponent(ConfigIpIntelligenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();

    component.lists = [
      {
        id: '1231', insertDate: new Date().toISOString(), name: 'test', updateDate: new Date().toISOString(), file: {
          source: 'test.txt'
        }
      }
    ]

    tick(1000);
    fixture.detectChanges();

    //check views
    const el1 = findEl(fixture, 'config-ip-intelligence-list-item', false);
    expect(el1).toBeTruthy();

    click(fixture, 'button-add');
    fixture.detectChanges();

    click(fixture, 'button-http');
    fixture.detectChanges();

    const el2 = findEls(fixture, 'config-ip-intelligence-list-item');
    expect(el2.length).toEqual(2);

    click(fixture, 'button-file');
    fixture.detectChanges();

    const el3 = findEls(fixture, 'config-ip-intelligence-list-item');
    expect(el3.length).toEqual(3);

    flush();

  }));
});

