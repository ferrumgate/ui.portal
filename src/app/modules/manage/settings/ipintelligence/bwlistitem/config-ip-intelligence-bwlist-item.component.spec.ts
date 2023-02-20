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
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigIpIntelligenceBWListItemComponent } from './config-ip-intelligence-bwlist-item.component';



describe('ConfigIpIntelligenceBWListItemComponent', () => {
  let component: ConfigIpIntelligenceBWListItemComponent;
  let fixture: ComponentFixture<ConfigIpIntelligenceBWListItemComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigIpIntelligenceBWListItemComponent],
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
    fixture = TestBed.createComponent(ConfigIpIntelligenceBWListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      host: 'hostx',
      user: 'user',
      pass: 'pass',
      deleteOldRecordsMaxDays: 9,
      isChanged: false
    }
    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'config-es-host-input', 'hostx');
    expectValue(fixture, 'config-es-user-input', 'user');

    setFieldValue(fixture, 'config-es-pass-input', 'newpass');
    dispatchFakeEvent(findEl(fixture, 'config-es-pass-input').nativeElement, 'blur');

    tick(1000);
    expect(component.model.isChanged).toBeTrue();
    fixture.detectChanges();

    httpClientSpy.put.and.returnValue(of(
      {
        host: 'eshost',
        user: 'esuser'
      }));
    spyOn(confirmService, 'showSave').and.returnValue(of(true));
    component.saveOrUpdate();
    tick(1000);
    fixture.detectChanges();

    expect(component.model.isChanged).toBeFalse();

    flush();


  })); */
});



