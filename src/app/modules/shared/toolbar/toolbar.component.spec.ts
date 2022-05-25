import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CaptchaService } from 'src/app/core/services/captcha.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TranslationService } from 'src/app/core/services/translation.service';

import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ToolbarComponent } from './toolbar.component';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../shared.module';


describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['loginLocal', 'getAccessToken', 'confirm2FA']);
  const captchaServiceSpy = jasmine.createSpyObj('CaptchaService', ['execute']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, RecaptchaV3Module, MatIconTestingModule, SharedModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
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
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
