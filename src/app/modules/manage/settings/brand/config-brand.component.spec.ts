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
import { ConfigBrandComponent } from './config-brand.component';



describe('ConfigBrandComponent', () => {
  let component: ConfigBrandComponent;
  let fixture: ComponentFixture<ConfigBrandComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigBrandComponent],
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
    fixture = TestBed.createComponent(ConfigBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      name: 'test',
      logoBlack: 'abc',
      logoWhite: 'def',
      logoBlackFileName: '', logoWhiteFileName: '',
      isChanged: false
    }
    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'config-brand-name-input', 'test');

    const fileuploadEl = findEl(fixture, 'list-fileupload-whitelogo', false);
    expect(fileuploadEl).toBeTruthy();

    const fileuploadEl2 = findEl(fixture, 'list-fileupload-blacklogo', false);
    expect(fileuploadEl2).toBeTruthy();

    //set name to else
    setFieldValue(fixture, 'config-brand-name-input', 'abcded')
    dispatchFakeEvent(findEl(fixture, 'config-brand-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.model.isChanged).toBeTrue;



  }));
});



