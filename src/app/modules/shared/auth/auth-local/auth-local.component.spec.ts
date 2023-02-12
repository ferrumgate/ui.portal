import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { dispatchFakeEvent, expectCheckValue, findEl, getCheckValue, setCheckValue } from '../../helper.spec';
import { AuthLocal } from '../../models/auth';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';

import { AuthLocalComponent } from './auth-local.component';

describe('AuthLocalComponent', () => {
  let component: AuthLocalComponent;
  let fixture: ComponentFixture<AuthLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthLocalComponent],
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
    fixture = TestBed.createComponent(AuthLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: AuthLocal = {
      baseType: 'local', name: 'Local', type: 'local', isForgotPassword: true, isRegister: true, isEnabled: true
    }
    component.model = {
      ...model
    }
    tick(1000);
    fixture.detectChanges();
    expect(component.model.isForgotPassword).toBeTrue();

    expectCheckValue(fixture, 'auth-local-forgotpassword-enabled', true);



  }));
});
