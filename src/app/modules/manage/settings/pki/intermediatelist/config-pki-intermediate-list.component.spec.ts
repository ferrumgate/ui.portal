import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigPKIIntermediateListComponent } from './config-pki-intermediate-list.component';

describe('ConfigPKIIntermediateListComponent', () => {
  let component: ConfigPKIIntermediateListComponent;
  let fixture: ComponentFixture<ConfigPKIIntermediateListComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigPKIIntermediateListComponent],
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
    fixture = TestBed.createComponent(ConfigPKIIntermediateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClientSpy.get.and.returnValue(of({ items: [] }))

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();

    component.certs = []
    let items = [
      {
        id: '1231', insertDate: new Date().toISOString(),
        name: 'test', updateDate: new Date().toISOString(),
        isEnabled: true, labels: []
      },
      {
        id: '1234', insertDate: new Date().toISOString(),
        name: 'test', updateDate: new Date().toISOString(),
        isEnabled: true, labels: []
      }
    ]

    //component.certs = items;
    httpClientSpy.get.and.returnValue(of({ items: items }))
    component.getAllData().subscribe();
    tick(1000);
    fixture.detectChanges();

    const el3 = findEls(fixture, 'config-pki-intermediate-cert');
    expect(el3.length).toEqual(2);
    flush();

  }));
});

