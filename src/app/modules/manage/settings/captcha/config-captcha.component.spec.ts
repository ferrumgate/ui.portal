import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { dispatchFakeEvent, expectValue, findEl, setFieldElementValue, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigCaptchaComponent } from './config-captcha.component';



describe('CaptchaCommonComponent', () => {
  let component: ConfigCaptchaComponent;
  let fixture: ComponentFixture<ConfigCaptchaComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigCaptchaComponent],
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
    fixture = TestBed.createComponent(ConfigCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      server: 'serverkey',
      client: 'clientkey',
      isChanged: false
    }
    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'config-captcha-server-input', 'serverkey');
    expectValue(fixture, 'config-captcha-client-input', 'clientkey');

    setFieldValue(fixture, 'config-captcha-server-input', 'servernewkey');
    dispatchFakeEvent(findEl(fixture, 'config-captcha-server-input').nativeElement, 'blur');

    tick(1000);
    fixture.detectChanges();

    httpClientSpy.put.and.returnValue(of(
      {
        server: 'servernewkey',
        client: 'clientkey'
      }));
    spyOn(confirmService, 'showSave').and.returnValue(of(true));
    component.saveOrUpdate();
    tick(1000);
    fixture.detectChanges();

    expect(component.model.isChanged).toBeFalse();

    flush();


  }));
});



