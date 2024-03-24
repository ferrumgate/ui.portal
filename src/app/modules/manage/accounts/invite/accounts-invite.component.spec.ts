import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { click, dispatchFakeEvent, expectValue, findEl, findEls, setFieldElementValue, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AccountsInviteComponent } from './accounts-invite.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';



describe('AccountsInviteComponent', () => {
  let component: AccountsInviteComponent;
  let fixture: ComponentFixture<AccountsInviteComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  let userService: UserService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsInviteComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        AuthenticationService,
        ConfigService,
        ConfigureService,
        NotificationService,
        TranslationService,
        ConfirmService,
        UserService,
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
    confirmService = TestBed.inject(ConfirmService);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(AccountsInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.model = {
      emails: 'test@ferrumgate.com',
      isChanged: false
    }
    tick(1000);
    fixture.detectChanges();
    //check two different view 
    const viewEmails = findEl(fixture, 'accounts-invite-view-emails', false);
    expect(viewEmails).toBeTruthy();
    const viewResults = findEl(fixture, 'accounts-invite-view-results', false);
    expect(viewResults).toBeFalsy();

    //set email field invalid value
    setFieldValue(fixture, 'accounts-invite-emails-input', '');
    dispatchFakeEvent(findEl(fixture, 'accounts-invite-emails-input').nativeElement, 'blur');

    tick(1000);
    fixture.detectChanges();
    expect(component.inviteFormGroup.invalid).toBeTrue();

    setFieldValue(fixture, 'accounts-invite-emails-input', 'test@ferrumgate.com');
    dispatchFakeEvent(findEl(fixture, 'accounts-invite-emails-input').nativeElement, 'blur');
    expect(component.inviteFormGroup.invalid).toBeFalse();

    //enter valid email and save

    spyOn(userService, 'invite').and.returnValue(of(
      {
        results: [
          {
            email: 'test@ferrumgate.com',
          },
          {
            email: 'test2@ferrumgate.com', errMsg: 'Already exists'
          }]
      }
    ))

    spyOn(confirmService, 'showAreYouSure').and.returnValue(of(true));
    component.saveOrUpdate()
    tick(1000);
    fixture.detectChanges();
    //check two different view 
    const viewEmails2 = findEl(fixture, 'accounts-invite-view-emails', false);
    expect(viewEmails2).toBeFalsy();
    const viewResults2 = findEl(fixture, 'accounts-invite-view-results', false);
    expect(viewResults2).toBeTruthy();

    //there must be two rows of result
    const resultItems = findEls(fixture, 'accounts-invite-results-item')
    expect(resultItems.length).toEqual(2);

    // click back button
    click(fixture, 'accounts-invite-results-back')
    tick(1000);
    fixture.detectChanges();
    //check two different view 
    const viewEmails3 = findEl(fixture, 'accounts-invite-view-emails', false);
    expect(viewEmails3).toBeTruthy();
    const viewResults3 = findEl(fixture, 'accounts-invite-view-results', false);
    expect(viewResults3).toBeFalsy();


    flush();


  }));
});



