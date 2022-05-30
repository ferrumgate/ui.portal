import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { dispatchFakeEvent, findEl, queryByCss, setFieldValue } from '../shared/helper.spec';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { ThemeSelectorComponent } from '../shared/themeselector/themeselector.component';

import { LoginCallbackComponent } from './logincallback.component';
import { LoginCallbackModule } from './logincallback.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';



describe('LoginCallbackComponent', () => {
  let component: LoginCallbackComponent;
  let fixture: ComponentFixture<LoginCallbackComponent>;

  const authServiceSpy = jasmine.createSpyObj('AuthenticationService',
    ['loginLocal', 'getAccessToken', 'confirm2FA', 'getUserCurrent'], ['currentSession']);
  const captchaServiceSpy = jasmine.createSpyObj('CaptchaService', ['execute']);

  let router: Router;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [LoginCallbackComponent, MatIcon],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule],
      providers: [
        ConfigService,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: CaptchaService, useValue: captchaServiceSpy },

        TranslationService, NotificationService,
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
    fixture = TestBed.createComponent(LoginCallbackComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.logincallback')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.logincallback > [fxLayout="row"]').length).toBe(1);

  });


});
