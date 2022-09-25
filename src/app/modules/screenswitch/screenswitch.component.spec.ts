import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { findEl } from '../shared/helper.spec';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ConfigService } from '../shared/services/config.service';
import { NotificationService } from '../shared/services/notification.service';
import { TranslationService } from '../shared/services/translation.service';
import { SharedModule } from '../shared/shared.module';

import { ScreenSwitchComponent } from './screenswitch.component';

describe('ScreenSwitchComponent', () => {
  let component: ScreenSwitchComponent;
  let fixture: ComponentFixture<ScreenSwitchComponent>;
  let authServiceSpy: AuthenticationService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenSwitchComponent, MatIcon],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule],
      providers: [
        ConfigService,
        TranslationService, NotificationService, AuthenticationService
      ]

    })
      .compileComponents();
  });

  beforeEach(() => {
    authServiceSpy = TestBed.inject(AuthenticationService);
    fixture = TestBed.createComponent(ScreenSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only use button must be active', () => {
    expect(component).toBeTruthy();
    spyOnProperty(authServiceSpy, 'currentSession', 'get').and.returnValue(
      {
        currentUser: {
          roles: [{ name: 'User' }]
        }
      } as any)
    const manageEl = findEl(fixture, 'screenswitch-manage', false);
    expect(manageEl).toBeFalsy();
    const useEl = findEl(fixture, 'screenswitch-use', false);
    expect(useEl).toBeTruthy();

  });

  it('manage and use button must be active', () => {

    spyOnProperty(authServiceSpy, 'currentSession', 'get').and.returnValue(
      {
        currentUser: {
          roles: [{ name: 'Admin' }]
        }
      } as any)
    let fixture = TestBed.createComponent(ScreenSwitchComponent);
    let component = fixture.componentInstance;
    fixture.detectChanges();



    expect(component).toBeTruthy();
    const manageEl = findEl(fixture, 'screenswitch-manage', false);
    expect(manageEl).toBeTruthy();
    const useEl = findEl(fixture, 'screenswitch-use', false);
    expect(useEl).toBeTruthy();

  });





});
