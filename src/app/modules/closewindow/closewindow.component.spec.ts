/* import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { findEl } from '../shared/helper.spec';
import { SharedModule } from '../shared/shared.module';

import { ConfirmEmailComponent } from './closewindow.component';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['confirmUserEmail']);
  const captchaServiceSpy = jasmine.createSpyObj('CaptchaService', ['execute']);

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module],
      providers: [
        ConfigService,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: CaptchaService, useValue: captchaServiceSpy },

        TranslationService, NotificationService,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        }
      ]

    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
    authServiceSpy.confirmUserEmail.and.returnValue(of(''));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isConfirmed).toBe(false);
  });
  it('email confirm show wait before confirming', fakeAsync(async () => {
    expect(component).toBeTruthy();
    //mat-card must exist
    const view = findEl(fixture, 'confirmemail-view');
    expect(view).toBeTruthy();

    const confirmed = findEl(fixture, 'confirmemail-confirmed', false);
    expect(confirmed).toBeFalsy();

    const notconfirmed = findEl(fixture, 'confirmemail-not-confirmed', false);
    expect(notconfirmed).toBeTruthy();

  }));

  it('email confirm will start confirm after 1000 ms', fakeAsync(async () => {

    spyOn(router, 'navigate');

    //create new elements because of spy
    authServiceSpy.confirmUserEmail.and.returnValue(of(''));
    let fixture = TestBed.createComponent(ConfirmEmailComponent);
    let component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component).toBeTruthy();
    tick(1000);
    flush();
    fixture.detectChanges();
    tick(3000);
    flush();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalled();
    expect(component.isConfirmed).toBeTrue();
    expect(authServiceSpy.confirmUserEmail).toHaveBeenCalled();

    const confirmed = findEl(fixture, 'confirmemail-confirmed', false);
    expect(confirmed).toBeTruthy();

    const notconfirmed = findEl(fixture, 'confirmemail-not-confirmed', false);
    expect(notconfirmed).toBeFalsy();

  }));

});
 */