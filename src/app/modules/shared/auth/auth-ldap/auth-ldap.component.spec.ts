import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldValue } from '../../helper.spec';
import { BaseLdap } from '../../models/auth';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { SharedModule } from '../../shared.module';

import { AuthLdapComponent } from './auth-ldap.component';

describe('AuthLdapComponent', () => {
  let component: AuthLdapComponent;
  let fixture: ComponentFixture<AuthLdapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthLdapComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLdapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding and error check', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: BaseLdap = {
      id: '', baseType: 'ldap', type: 'activedirectory',
      name: 'Active Directory', host: 'ldaphost', bindDN: 'myadmin',
      bindPass: 'mypass', groupnameField: 'memberOf', searchBase: 'cn=users',
      usernameField: 'usernamefield', allowedGroups: ['testgroup']
    }
    component.model = model;
    tick(100);
    fixture.detectChanges();
    const testHostInput = 'auth-ldap-host-input';
    expectValue(fixture, testHostInput, 'ldaphost');
    expect(component.error.host).toBeFalsy();

    const testBindDNInput = 'auth-ldap-binddn-input';
    expectValue(fixture, testBindDNInput, 'myadmin');
    expect(component.error.bindDN).toBeFalsy();


    const testBindPassInput = 'auth-ldap-bindpass-input';
    expectValue(fixture, testBindPassInput, 'mypass');
    expect(component.error.bindPass).toBeFalsy();


    const testSearchBaseInput = 'auth-ldap-searchbase-input';
    expectValue(fixture, testSearchBaseInput, 'cn=users');
    expect(component.error.searchBase).toBeFalsy();

    const testUsernameFieldInput = 'auth-ldap-usernamefield-input';
    expectValue(fixture, testUsernameFieldInput, 'usernamefield');
    expect(component.error.usernameField).toBeFalsy();

    const testGroupnameFieldInput = 'auth-ldap-groupnamefield-input';
    expectValue(fixture, testGroupnameFieldInput, 'memberOf');
    expect(component.error.groupnameField).toBeFalsy();

    const testAllowedGroupsInput = 'auth-ldap-allowedgroups-chip';
    const items = findEls(fixture, testAllowedGroupsInput)
    expect(items.length).toBe(1);

    const testOkButton = 'auth-ldap-ok-button';
    expect(findEl(fixture, testOkButton, false)).toBeFalsy();
    expect(component.formGroup.valid).toBeTrue();

    //check error
    setFieldValue(fixture, testHostInput, '');
    dispatchFakeEvent(findEl(fixture, testHostInput).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.error.host).toBeTruthy();
    expect(component.formGroup.invalid).toBeTrue();


  }))

});
