import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, setFieldValue } from '../../helper.spec';
import { BaseRadius } from '../../models/auth';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';
import { AuthRadiusComponent } from './auth-radius.component';

describe('AuthRadiusComponent', () => {
  let component: AuthRadiusComponent;
  let fixture: ComponentFixture<AuthRadiusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthRadiusComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRadiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding and error check', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: BaseRadius = {
      id: '', baseType: 'radius', type: 'generic', name: 'FreeRadius', host: '192.168.1.1',
      secret: 'somesecret', isEnabled: true
    }
    component.model = model;
    tick(100);
    fixture.detectChanges();
    const testIdHost = 'auth-radius-host-input';
    const testIdSecret = 'auth-radius-secret-input';
    const testIdSaveButton = 'auth-radius-ok-button';
    //check value binding
    expectValue(fixture, testIdHost, '192.168.1.1');
    expectValue(fixture, testIdSecret, 'somesecret');
    expect(component.error.host).toBeFalsy();
    const buttonSave = findEl(fixture, testIdSaveButton, false);
    expect(buttonSave).toBeFalsy();

    //check error
    setFieldValue(fixture, testIdHost, '');
    dispatchFakeEvent(findEl(fixture, testIdHost).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.error.host).toBeTruthy();
    expect(component.formGroup.invalid).toBeTrue();

  }));
});
