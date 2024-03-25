import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, findEl, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigIpIntelligenceSourceComponent } from './config-ip-intelligence-source.component';

describe('ConfigIpIntelligenceSourceComponent', () => {
  let component: ConfigIpIntelligenceSourceComponent;
  let fixture: ComponentFixture<ConfigIpIntelligenceSourceComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigIpIntelligenceSourceComponent],
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
    fixture = TestBed.createComponent(ConfigIpIntelligenceSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    tick(1000);
    fixture.detectChanges();
    const apiKeyInput = findEl(fixture, 'config-ip-intelligence-source-apikey-input', false);
    expect(apiKeyInput).toBeFalsy();

    component.model = {
      type: 'test', name: 'test', id: '', insertDate: '', updateDate: 'a'
    }
    tick(1000);
    fixture.detectChanges();

    const apiKeyInput2 = findEl(fixture, 'config-ip-intelligence-source-apikey-input', false);
    expect(apiKeyInput2).toBeTruthy();

    expect(component.formGroup.invalid).toBeTrue();
    setFieldValue(fixture, 'config-ip-intelligence-source-apikey-input', 'newpass');
    dispatchFakeEvent(findEl(fixture, 'config-ip-intelligence-source-apikey-input').nativeElement, 'blur');

    expect(component.formGroup.valid).toBeTrue();

    tick(1000);
    fixture.detectChanges();
    const okButton = findEl(fixture, 'setttings-config-ip-intelligence-source-ok-button');
    expect(okButton).toBeTruthy();

    flush();

  }));
});

