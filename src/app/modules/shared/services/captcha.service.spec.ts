import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha';
import { of } from 'rxjs';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  let configService: ConfigService;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), RecaptchaV3Module, HttpClientModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        },
        ReCaptchaV3Service,
        ConfigService,
        LoggerService,
      ]

    });

    configService = TestBed.inject(ConfigService);

    service = TestBed.inject(CaptchaService);
    service.setIsEnabled(false);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('captcha must create a token', (done) => {

    httpClientSpy.get.and.returnValue(of({ captchaSiteKey: '6Lcw_scfAAAAABL_DeZVQNd-yNHp0CnNYE55rifH' }));
    service.captchaKey = '6Lcw_scfAAAAABL_DeZVQNd-yNHp0CnNYE55rifH';
    service.setIsEnabled(true);
    service.executeIfEnabled('test').subscribe(x => {
      expect(service.getIsEnabled()).toBeTrue;
      expect(x).toBeTruthy();
      done();
    }, (err) => {

      expect(err).toBeFalsy();
    })
  })
});
