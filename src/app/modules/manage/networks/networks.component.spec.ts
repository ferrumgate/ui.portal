import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CaptchaService } from '../../shared/services/captcha.service';
import { ConfigService } from '../../shared/services/config.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslationService } from '../../shared/services/translation.service';
import { SharedModule } from '../../shared/shared.module';

import { NetworksComponent } from './networks.component';

describe('NetworksComponent', () => {
  let component: NetworksComponent;
  let fixture: ComponentFixture<NetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworksComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        HttpClient,
        { provider: ConfigService, useValue: {} },
        AuthenticationService,
        TranslationService,
        NotificationService,
        CaptchaService,
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
    fixture = TestBed.createComponent(NetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
