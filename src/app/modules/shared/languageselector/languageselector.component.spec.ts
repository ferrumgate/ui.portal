import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';

import { LanguageSelectorComponent } from './languageselector.component';


describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  const translationService = jasmine.createSpyObj('TranslationService', ['getAllLanguages', 'getCurrentLang']);
  beforeEach(async () => {


    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [RouterTestingModule,
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

  it('should create with 2 languages', () => {
    //mock services
    translationService.getAllLanguages.and.returnValue(['en', 'tr'])
    translationService.getCurrentLang.and.returnValue('en');

    //after mocking create services
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    let ops = translationService.getAllLanguages();
    const element = fixture.debugElement.query(By.css('mat-select'))
    expect(element).toBeTruthy();
    const options = fixture.debugElement.queryAll(By.css('mat-option'))
    expect(options.length).toBe(2);

    const options2 = fixture.nativeElement.querySelectorAll('mat-option');
    expect(options2[0].textContent).toBe('en');

  });

  it('should create with 1 languages', () => {
    //mock services
    translationService.getAllLanguages.and.returnValue(['en'])
    translationService.getCurrentLang.and.returnValue('en');
    //create components
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    const element = fixture.debugElement.query(By.css('mat-select'))
    expect(element).toBeTruthy();
    const options = fixture.debugElement.queryAll(By.css('mat-option'))
    expect(options.length).toBe(1);

    const options2 = fixture.nativeElement.querySelectorAll('mat-option');
    expect(options2[0].textContent).toBe('en');

  });
});
