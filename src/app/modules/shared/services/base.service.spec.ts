import { of } from "rxjs";
import { BaseService } from "./base.service";

describe('BaseService', () => {

  let service: BaseService;
  let captchaService = jasmine.createSpyObj('CaptchaService', ['executeIfEnabled']);
  beforeEach(() => {
    service = new BaseService('abc', captchaService)

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('joinUrl', (done) => {
    const url = service.joinUrl('http://localhost', 'item')
    expect(url).toBe('http://localhost/item');

    const searchParam = new URLSearchParams({ test1: 'test2', test3: '4' });
    const url2 = service.joinUrl('http://test.me', 'itemId', searchParam);
    expect(url2).toBe('http://test.me/itemId?test1=test2&test3=4')

    done();
  })

  it('preExecute', (done) => {
    const test = {} as any;
    captchaService.executeIfEnabled.and.returnValue(of('captchatoken'))
    service.preExecute(test).subscribe(y => {

      expect(y.captcha).toBeTruthy();
      done();
    })
  })
});
