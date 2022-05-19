import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { click, queryAllByCss, queryByCss } from '../helper.spec';
import { MaterialModule } from '../material-module';
import { SharedModule } from '../shared.module';

import { LanguageSelectorComponent } from './languageselector.component';


describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  const translationService = jasmine.createSpyObj('TranslationService', ['getAllLanguages', 'getCurrentLang']);
  beforeEach(async () => {


    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [RouterTestingModule, MaterialModule, BrowserAnimationsModule,
        TranslateModule.forRoot(), HttpClientModule],
      providers: [
        TranslateService,
        ConfigService,
        {
          provide: TranslationService, useValue: translationService
        }
      ]
    })
      .compileComponents();
    // translationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;

  });

  beforeEach(() => {
    /*fixture = TestBed.createComponent(LanguageSelectorComponent);
     component = fixture.componentInstance;
     fixture.detectChanges(); */
  });

  it('should create with 2 languages', fakeAsync(async () => {
    //mock services
    translationService.getAllLanguages.and.returnValue(['en', 'tr'])
    translationService.getCurrentLang.and.returnValue('en');

    //after mocking create services
    let fixture = TestBed.createComponent(LanguageSelectorComponent);
    let component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    expect(translationService.getAllLanguages).toHaveBeenCalled();
    expect(component.items.length).toBe(2);
    const element = queryByCss(fixture, 'mat-select');
    expect(element).toBeTruthy();
    const selectTrigger = queryByCss(fixture, '.mat-select-trigger');
    selectTrigger.triggerEventHandler('click', {});
    fixture.detectChanges();
    const options = queryAllByCss(fixture, '.mat-select-panel mat-option');
    expect(options.length).toBe(2);
    expect(options[0].nativeElement.textContent).toBe('en');

  }));

  it('should create with 1 languages', fakeAsync(async () => {
    //mock services
    translationService.getAllLanguages.and.returnValue(['en'])
    translationService.getCurrentLang.and.returnValue('en');
    //create components
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    const element = queryByCss(fixture, 'mat-select');
    expect(element).toBeTruthy();
    const selectTrigger = queryByCss(fixture, '.mat-select-trigger');
    selectTrigger.triggerEventHandler('click', {});
    fixture.detectChanges();
    const options = queryAllByCss(fixture, '.mat-select-panel mat-option');
    expect(options[0].nativeElement.textContent).toBe('en');

  }));
});
