import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { dispatchFakeEvent, findEl, queryByCss, setFieldValue } from '../shared/helper.spec';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { ThemeSelectorComponent } from '../shared/themeselector/themeselector.component';

import { Confirm2FAComponent } from './confirm2fa.component';

import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';



describe('Confirm2FAComponent', () => {
  let component: Confirm2FAComponent;
  let fixture: ComponentFixture<Confirm2FAComponent>;

  const authServiceSpy = jasmine.createSpyObj('AuthenticationService',
    ['loginLocal', 'getAccessToken', 'confirm2FA', 'getUserCurrent'], ['currentSession']);
  const captchaServiceSpy = jasmine.createSpyObj('CaptchaService', ['execute']);

  let router: Router;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [Confirm2FAComponent, MatIcon],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule],
      providers: [

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
    fixture = TestBed.createComponent(Confirm2FAComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.confirm2fa')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.confirm2fa > [fxLayout="row"]').length).toBe(1);

  });



  it('confirm2fa 2fa form token input', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.is2FA = true;
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.form2FA.invalid).toBe(true);

    //work on password field
    const tokenId = 'confirm2fa-2fa-input';
    const tokenForm = component.form2FA.controls['token'];

    setFieldValue(fixture, tokenId, '');
    dispatchFakeEvent(findEl(fixture, tokenId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();




    //check password values
    expect(component.model2fa.token).toBe('');
    expect(tokenForm.errors).toBeTruthy();
    expect(component.error2fa.token).toBeTruthy();
    expect(findEl(fixture, 'confirm2fa-2fa-error')).toBeTruthy();

    //set normal
    setFieldValue(fixture, tokenId, 'somepassword');
    dispatchFakeEvent(findEl(fixture, tokenId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.model2fa.token).toBe('somepassword');
    expect(tokenForm.errors).toBeFalsy();
    expect(component.error2fa.token).toBeFalsy();
    expect(findEl(fixture, 'confirm2fa-2fa-error', false)).toBeFalsy();


  }));


  it('confirm2fa 2fa form submit', fakeAsync(async () => {

    component.is2FA = true;
    fixture.detectChanges();
    const tokenId = 'confirm2fa-2fa-input'


    setFieldValue(fixture, tokenId, '123345');
    dispatchFakeEvent(findEl(fixture, tokenId).nativeElement, 'blur');


    fixture.detectChanges();
    //tick(1200);
    //fixture.detectChanges();
    spyOn(router, 'navigate');

    expect(component.form2FA.valid).toBeTrue();
    expect(component.model2fa.token).toBeTruthy();
    expect(findEl(fixture, 'confirm2fa-2fa-button').properties['disabled']).toBe(false);

    authServiceSpy.confirm2FA.and.returnValue(of({ key: 'adfaf' }))
    authServiceSpy.getAccessToken.and.returnValue(of({ accessToken: 'adfaf' }))

    //click submit

    findEl(fixture, 'confirm2fa-form2fa').triggerEventHandler('submit', {});
    expect(authServiceSpy.confirm2FA).toHaveBeenCalled();

    flush();

  }));

});
