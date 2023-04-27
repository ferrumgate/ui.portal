/* import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { AuthSettings } from 'src/app/modules/shared/models/auth';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ConfigDevicePostureComponent } from './config-deviceposture.component';

describe('ConfigAuthComponent', () => {
  let component: ConfigAuthComponent;
  let fixture: ComponentFixture<ConfigAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigAuthComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: AuthSettings = {
      common: {},
      local: {
        baseType: 'local', name: 'Local', type: 'local', isForgotPassword: true, isRegister: true, isEnabled: true
      },
      oauth: {
        providers: [
          { id: 'someid2', baseType: 'oauth', name: 'Google', type: 'google', clientId: 'someid', clientSecret: 'somesecret', isEnabled: true },
          { id: 'someid3', baseType: 'oauth', name: 'Linked', type: 'linkedin', clientId: 'someid', clientSecret: 'somesecret', isEnabled: true }
        ]
      }
    }
    component.model = model;
    tick(1000);
    fixture.detectChanges();
    const locals = findEls(fixture, 'config-auth-local');
    expect(locals.length).toEqual(1);

    const oauth2 = findEls(fixture, 'config-auth-oauth');
    expect(oauth2.length).toEqual(2);

  }));
});
 */