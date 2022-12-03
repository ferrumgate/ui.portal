import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { checkField, dispatchFakeEvent, expectCheckValue, expectText, expectValue, findEl, findEls, queryByCss, setFieldValue } from '../../helper.spec';
import { CaptchaService } from '../../services/captcha.service';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';



import { DashboardStatusComponent } from './dashboard-status.component';

describe('DashboardStatusComponent', () => {
  let component: DashboardStatusComponent;
  let fixture: ComponentFixture<DashboardStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardStatusComponent],
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
    fixture = TestBed.createComponent(DashboardStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    component.count = '5';
    component.detail = 'some detail';
    component.helpLink = 'http://test.com';
    component.icon = 'lan';
    component.title = 'test';
    fixture.detectChanges();

    const icon = 'dashboard-status-icon';
    //check if element exists
    const iconElement = findEl(fixture, icon);
    //
    expectText(fixture, icon, 'lan');

    expectText(fixture, 'dashboard-status-title', 'test5');
    expectText(fixture, 'dashboard-status-detail', 'some detail');



  }));
});

