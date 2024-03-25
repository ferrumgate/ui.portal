import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { expectText, findEl } from '../../helper.spec';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';
import { DashboardChartComponent } from './dashboard-chart.component';

describe('DashboardChartComponent', () => {
  let component: DashboardChartComponent;
  let fixture: ComponentFixture<DashboardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardChartComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {

    component.helpLink = 'http://test.com';
    component.icon = 'lan';
    component.title = 'test';
    fixture.detectChanges();

    const icon = 'dashboard-chart-icon';
    //check if element exists
    const iconElement = findEl(fixture, icon);
    //
    expectText(fixture, icon, 'lan');

    expectText(fixture, 'dashboard-chart-title', 'test');

  }));
});

