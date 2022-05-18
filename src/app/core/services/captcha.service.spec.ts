import { HttpClient, HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { defer, of } from 'rxjs';

import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  let logger: LoggerService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RecaptchaV3Module, HttpClientModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        },
        ReCaptchaV3Service,
        ConfigService,
        LoggerService
      ]

    });
    service = TestBed.inject(CaptchaService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('captcha must create a token', (done) => {
    httpClientSpy.get.and.returnValue(of({ captchaSiteKey: '6Lcw_scfAAAAABL_DeZVQNd-yNHp0CnNYE55rifH' }))
    service.execute('test').subscribe(x => {

      expect(x).toBeTruthy();
      done();
    }, (err) => {

      expect(err).toBeFalsy();
    })
  })
});
