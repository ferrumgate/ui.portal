import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [TranslateService]
    });
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initLanguages', () => {
    service.initLanguages();
    expect(service.getCurrentLang()).toBe('en');
  });
  it('initLanguages with unknown language', () => {
    service.initLanguages('somelanguage');
    expect(service.getCurrentLang()).toBe('en');
  });

  it('setDefaultLang', () => {
    service.initLanguages('somelanguage');
    service.setDefaultLang('tr');
    expect(service.getCurrentLang()).toBe('en');
    expect(service.getDefaultLang()).toBe('tr');
  });
  it('getAllLanguages', () => {

    const langs = service.getAllLanguages();
    expect(langs.length > 0).toBeTrue();

  });



});
