import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';
import { ConfigureService } from './configure.service';



describe('ConfigureService', () => {
  let service: ConfigureService;
  let httpClient: HttpClient;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [TranslateService, { provider: ConfigService, useValue: {} }, HttpClient,
        CaptchaService,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        }
      ]
    });
    service = TestBed.inject(ConfigureService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });







});
