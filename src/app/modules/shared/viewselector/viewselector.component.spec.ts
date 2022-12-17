import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FixedTileStyler } from '@angular/material/grid-list/tile-styler';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from '../shared.module';

import { ViewSelectorComponent } from './viewselector.component';

describe('ViewSelectorComponent', () => {
  let component: ViewSelectorComponent;
  let fixture: ComponentFixture<ViewSelectorComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [ViewSelectorComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, SharedModule],
      providers: [
        ConfigService, AuthenticationService, TranslationService, TranslateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-slide-toggle')).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.selection = 'low';
    component.selectionMap = { low: 'User', high: 'Admin' };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-slide-toggle')).toBeTruthy();

    expect(fixture.nativeElement.querySelector('mat-slide-toggle').classList.contains('mat-checked')).toBeFalse();
    expect(fixture.nativeElement.querySelector('mat-slide-toggle').textContent.trim()).toBe('User');
  });
  it('click', () => {
    component.selection = 'low';
    component.selectionMap = { low: 'User', high: 'Admin' };
    fixture.debugElement.query(By.css('mat-slide-toggle')).triggerEventHandler('change', {});
    fixture.detectChanges();
    console.log(fixture.nativeElement.querySelector('mat-slide-toggle').textContent.trim());
    expect(fixture.nativeElement.querySelector('mat-slide-toggle').textContent.trim()).toBe('Admin');
  });
});
