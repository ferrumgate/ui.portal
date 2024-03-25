import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigCommonComponent } from './config-common.component';

describe('ConfigCommonComponent', () => {
  let component: ConfigCommonComponent;
  let fixture: ComponentFixture<ConfigCommonComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigCommonComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        AuthenticationService,
        ConfigService,
        ConfigureService,
        NotificationService,
        TranslationService,
        CaptchaService,
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
    fixture = TestBed.createComponent(ConfigCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      url: 'https://security.ferrumgate.com',
      domain: 'ferrumgate.me',
      isChanged: false
    }
    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'config-common-url-input', 'https://security.ferrumgate.com');
    expectValue(fixture, 'config-common-domain-input', 'ferrumgate.me');

    setFieldValue(fixture, 'config-common-url-input', 'https://sec.ferrumgate.com');
    dispatchFakeEvent(findEl(fixture, 'config-common-url-input').nativeElement, 'blur');

    tick(1000);
    fixture.detectChanges();

    httpClientSpy.put.and.returnValue(of(
      {
        url: 'https://sec.ferrumgate.com',
        domain: 'ferrumgate.me'
      }));
    spyOn(confirmService, 'showSave').and.returnValue(of(true));
    component.saveOrUpdate();
    tick(1000);
    fixture.detectChanges();

    expect(component.model.isChanged).toBeFalse();

    flush();

  }));
});

