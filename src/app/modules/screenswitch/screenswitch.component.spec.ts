import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
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
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
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

});
