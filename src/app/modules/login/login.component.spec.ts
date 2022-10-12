import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { AuthenticationService, Session } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { dispatchFakeEvent, findEl, queryByCss, setFieldValue } from '../shared/helper.spec';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { ThemeSelectorComponent } from '../shared/themeselector/themeselector.component';

import { LoginComponent } from './login.component';
import { LoginModule } from './login.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  //const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  /* const authServiceSpy = jasmine.createSpyObj('AuthenticationService',
    ['loginLocal', 'getAccessToken', 'confirm2FA', 'getUserCurrent', 'login'], ['currentSession']); */
  let authService: AuthenticationService;
  let captchaService: CaptchaService;
  let httpClient: HttpClient;
  let router: Router;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, MatIcon],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NgIdleKeepaliveModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        HttpClient,
        ConfigService,
        AuthenticationService,
        TranslationService, NotificationService,
        CaptchaService,
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
    captchaService = TestBed.inject(CaptchaService);
    captchaService.setIsEnabled(false);
    authService = TestBed.inject(AuthenticationService);
    fixture = TestBed.createComponent(LoginComponent);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.get(Router)
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(httpClient, 'get').and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.login')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.login > [fxLayout="row"]').length).toBe(1);

  });

  it('login form email input', fakeAsync(async () => {
    expect(component).toBeTruthy();

    expect(component.form.invalid).toBe(true);

    expect(findEl(fixture, 'login-submit-button').properties['disabled']).toBe(true);

    const form = queryByCss(fixture, 'form');
    const inputs = form.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(2);

    //work on email field
    const emailId = 'login-email-input';
    const emailForm = component.form.controls['email'];

    setFieldValue(fixture, emailId, 'someone');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();


    //email
    expect(component.model.email).toBe('someone');
    expect(emailForm.errors).toBeTruthy();
    expect(component.error.email).toBeTruthy();
    expect(findEl(fixture, 'login-email-error')).toBeTruthy();

    //set normal email
    setFieldValue(fixture, emailId, 'someone@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.email).toBe('someone@gmail.com');
    expect(emailForm.errors).toBeFalsy();
    expect(component.error.email).toBeFalsy();
    expect(findEl(fixture, 'login-email-error', false)).toBeFalsy();


  }));



  it('login form password input', fakeAsync(async () => {
    expect(component).toBeTruthy();

    expect(component.form.invalid).toBe(true);

    //work on password field
    const passwordId = 'login-password-input';
    const passwordForm = component.form.controls['password'];

    setFieldValue(fixture, passwordId, '');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();




    //check password values
    expect(component.model.password).toBe('');
    expect(passwordForm.errors).toBeTruthy();
    expect(component.error.password).toBeTruthy();
    expect(findEl(fixture, 'login-password-error')).toBeTruthy();

    //set normal
    setFieldValue(fixture, passwordId, 'somepassword');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.model.password).toBe('somepassword');
    expect(passwordForm.errors).toBeFalsy();
    expect(component.error.password).toBeFalsy();
    expect(findEl(fixture, 'login-password-error', false)).toBeFalsy();


  }));

  it('login form submit', fakeAsync(async () => {


    const emailId = 'login-email-input'
    const passwordId = 'login-password-input'


    setFieldValue(fixture, emailId, 'test@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');

    setFieldValue(fixture, passwordId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');


    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();
    expect(component.model.email).toBeTruthy();
    expect(component.model.password).toBeTruthy();
    expect(component.error.login).toBeFalsy();
    expect(findEl(fixture, 'login-submit-button').properties['disabled']).toBe(false);

    const authServiceSpy = spyOn(authService, 'loginLocal');
    authServiceSpy.and.returnValue(of(true))

    //click submit

    findEl(fixture, 'login-form').triggerEventHandler('submit', {});
    expect(authServiceSpy).toHaveBeenCalled();



  }));

  /* it('captcha service must be called if needed', fakeAsync(async () => {


    const emailId = 'login-email-input'
    const passwordId = 'login-password-input'


    setFieldValue(fixture, emailId, 'test@gmail.com');
    dispatchFakeEvent(findEl(fixture, emailId).nativeElement, 'blur');

    setFieldValue(fixture, passwordId, 'Deneme123');
    dispatchFakeEvent(findEl(fixture, passwordId).nativeElement, 'blur');

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();
    expect(component.model.email).toBeTruthy();
    expect(component.model.password).toBeTruthy();
    expect(component.error.login).toBeFalsy();
    expect(findEl(fixture, 'login-submit-button').properties['disabled']).toBe(false);


    const authServiceSpy = spyOnProperty(authService, 'currentSession', "get");


    authServiceSpy
      .and.returnValue({
        currentUser: {
          roles: []
        } as any
      } as any)

    captchaService.setIsEnabled(true);
    const captchaServiceSpy = spyOn(captchaService, 'execute');
    captchaServiceSpy.and.returnValue(of('sometoken'));
    const authServiceSpy2=spyOn(authService,'login');
    authServiceSpy.login.and.returnValue(of({}));
    httpClientSpy.post.and.returnValue(of({}));


    //click submit
    findEl(fixture, 'login-form').triggerEventHandler('submit', {});

    //fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(captchaServiceSpy).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalled();


  }));
 */



});
