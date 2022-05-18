import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [TranslateService]
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('init', () => {
    let emitted = false;
    service.themeChanged.subscribe(x => {
      emitted = true;
    })
    service.init();//allready cleared localstorage
    expect(service.getTheme()).toBe('white');
    expect(emitted).toBe(true);
    expect(service.getLanguage()).toBe(undefined);

    //save 
    localStorage.setItem('theme_for_user_empty', 'dark')
    emitted = false;
    service.init();
    expect(service.getTheme()).toBe('dark');

  });

  it('saveTheme getTheme', () => {
    expect(service.getTheme()).toBe('white');
    let emitted = false;
    service.themeChanged.subscribe(x => {
      emitted = true;
    })
    service.saveTheme('dark');
    expect(emitted).toBe(true);
  });

  it('getLanguage saveLanguage', () => {
    service.init();
    expect(service.getLanguage()).toBe(undefined);
    let emitted = false;
    service.langChanged.subscribe(x => {
      emitted = true;
    })
    service.saveLanguage('en');
    expect(emitted).toBe(true);
    expect(service.getLanguage()).toBe('en');
  });


  it('changeUser', () => {
    service.init();
    expect(service.userId).toBe('empty');

    service.changeUser('adfaf');
    expect(service.userId).toBe('adfaf');

  });

});
