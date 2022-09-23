import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { dispatchFakeEvent, findEl, queryByCss, setFieldValue } from '../shared/helper.spec';
import { AuthenticationService } from '../shared/services/authentication.service';
import { SharedModule } from '../shared/shared.module';

import { ConfigureComponent } from './configure.component';

describe('ConfigureComponent', () => {
  let component: ConfigureComponent;
  let fixture: ComponentFixture<ConfigureComponent>;
  let authService: AuthenticationService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, SharedModule],
      providers: [
        AuthenticationService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    //spyOn(authService,)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.configure')).toBeTruthy;
  });

  it('default admin user input', fakeAsync(async () => {
    expect(component).toBeTruthy();

    tick(1000);//wait a little
    // on load we must load default values and form must be valid
    fixture.detectChanges();
    expect(component.userFormGroup.valid).toBe(true);
    ////////// email
    //set email to empty
    setFieldValue(fixture, 'configure-email-input', '');
    const el = queryByCss(fixture, 'form')
    dispatchFakeEvent(findEl(fixture, 'configure-email-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.email).toBe('EmailRequired');

    //set email not valid
    setFieldValue(fixture, 'configure-email-input', 'notAnEmailAddress');
    dispatchFakeEvent(findEl(fixture, 'configure-email-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.email).toBe('EmailInvalid');

    //set email valid 
    setFieldValue(fixture, 'configure-email-input', 'admin@ferrumgate.com');
    dispatchFakeEvent(findEl(fixture, 'configure-email-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.email).toBe('');
    ///////////// password
    //set password empty
    setFieldValue(fixture, 'configure-password-input', '');
    dispatchFakeEvent(findEl(fixture, 'configure-password-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.password).toBe('PasswordRequired');

    //set password not valid
    setFieldValue(fixture, 'configure-password-input', 'notavalidpassword');
    dispatchFakeEvent(findEl(fixture, 'configure-password-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.password).toBe('PasswordPattern');

    //set email valid 
    setFieldValue(fixture, 'configure-password-input', '8CharacterPassword1Upper1lower');
    dispatchFakeEvent(findEl(fixture, 'configure-password-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.password).toBe('');

    //////////////password again
    //set password again empty
    setFieldValue(fixture, 'configure-password-again-input', '');
    dispatchFakeEvent(findEl(fixture, 'configure-password-again-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.passwordAgain).toBe('PasswordAgainRequired');

    //set password again not valid
    setFieldValue(fixture, 'configure-password-again-input', 'notavalidpassword');
    dispatchFakeEvent(findEl(fixture, 'configure-password-again-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.passwordAgain).toBe('PasswordAgainPattern');

    //set password again valid 
    setFieldValue(fixture, 'configure-password-again-input', '8CharacterPassword1Upper1lower');
    dispatchFakeEvent(findEl(fixture, 'configure-password-again-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.passwordAgain).toBe('');


    //set passwords different valid 
    setFieldValue(fixture, 'configure-password-again-input', '8CharacterPassword1Upper1lowerButDifferent');
    dispatchFakeEvent(findEl(fixture, 'configure-password-again-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.userError.passwordAgain).toBe('PasswordsMismatch');






  }));


  it('default common input', fakeAsync(async () => {
    expect(component).toBeTruthy();

    tick(1000);//wait a little
    // on load we must load default values and form must be valid
    fixture.detectChanges();
    expect(component.commonFormGroup.valid).toBe(true);

    //set domain to empty
    setFieldValue(fixture, 'configure-domain-input', '');

    dispatchFakeEvent(findEl(fixture, 'configure-domain-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.commonError.domain).toBe('DomainRequired');

    //set domain not valid
    setFieldValue(fixture, 'configure-domain-input', 'ferrumgate');
    dispatchFakeEvent(findEl(fixture, 'configure-domain-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.commonError.domain).toBe('DomainInvalid');




    //set url to empty
    setFieldValue(fixture, 'configure-url-input', '');

    dispatchFakeEvent(findEl(fixture, 'configure-url-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.commonError.url).toBe('UrlRequired');

    //set domain not valid
    setFieldValue(fixture, 'configure-url-input', 'ferrumgate');
    dispatchFakeEvent(findEl(fixture, 'configure-url-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.commonError.url).toBe('UrlInvalid');





  }));

  it('default network input', fakeAsync(async () => {
    expect(component).toBeTruthy();

    tick(1000);//wait a little
    // on load we must load default values and form must be valid
    fixture.detectChanges();
    expect(component.networkFormGroup.valid).toBe(true);

    //set clientnetwork to empty
    setFieldValue(fixture, 'configure-clientnetwork-input', '');

    dispatchFakeEvent(findEl(fixture, 'configure-clientnetwork-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.networkError.clientNetwork).toBe('ClientNetworkRequired');

    //set clientnetwork not valid
    setFieldValue(fixture, 'configure-clientnetwork-input', '10.1');
    dispatchFakeEvent(findEl(fixture, 'configure-clientnetwork-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.networkError.clientNetwork).toBe('ClientNetworkInvalid');




    //set servicenetwork to empty
    setFieldValue(fixture, 'configure-servicenetwork-input', '');

    dispatchFakeEvent(findEl(fixture, 'configure-servicenetwork-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.networkError.serviceNetwork).toBe('ServiceNetworkRequired');

    //set service not valid
    setFieldValue(fixture, 'configure-servicenetwork-input', '10.2');
    dispatchFakeEvent(findEl(fixture, 'configure-servicenetwork-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.networkError.serviceNetwork).toBe('ServiceNetworkInvalid');





  }));


});
