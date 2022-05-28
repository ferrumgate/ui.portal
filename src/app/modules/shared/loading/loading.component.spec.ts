import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { findEl } from '../helper.spec';
import { LoadingService } from '../services/loading.service';
import { SharedModule } from '../shared.module';

import { LoadingComponent } from './loading.component';


describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: LoadingService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, SharedModule],

    })
      .compileComponents();
    loadingService = TestBed.inject(LoadingService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show hide must work', fakeAsync(async () => {
    loadingService.show();
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    const element = findEl(fixture, 'loading');
    expect(element).toBeTruthy();

    loadingService.hide();
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    const element2 = findEl(fixture, 'loading', false);
    expect(element2).toBeFalsy();

  }));
});
