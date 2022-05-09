import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { SharedModule } from '../shared.module';

import { ThemeSelectorComponent } from './themeselector.component';

describe('ThemeSelectorComponent', () => {
  let component: ThemeSelectorComponent;
  let fixture: ComponentFixture<ThemeSelectorComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [ThemeSelectorComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), BrowserAnimationsModule, SharedModule],
      providers: [
        ConfigService, AuthenticationService, TranslationService, TranslateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-slide-toggle')).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-slide-toggle')).toBeTruthy();

    expect(fixture.nativeElement.querySelector('mat-slide-toggle').classList.contains('mat-checked')).toBeFalse();
    expect(fixture.nativeElement.querySelector('mat-slide-toggle').textContent.trim()).toBe('Dark');
  });
  it('click', () => {

    fixture.debugElement.query(By.css('mat-slide-toggle')).triggerEventHandler('change', {});
    fixture.detectChanges();
    console.log(fixture.nativeElement.querySelector('mat-slide-toggle').textContent.trim());
    expect(fixture.nativeElement.querySelector('mat-slide-toggle').textContent.trim()).toBe('White');
  });
});
