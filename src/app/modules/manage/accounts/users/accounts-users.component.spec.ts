import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { RBACDefault } from 'src/app/modules/shared/models/rbac';
import { User2 } from 'src/app/modules/shared/models/user';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';



import { AccountsUsersComponent } from './accounts-users.component';

describe('AccountsUsersComponent', () => {
  let component: AccountsUsersComponent;
  let fixture: ComponentFixture<AccountsUsersComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsUsersComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
        CaptchaService,
        GroupService,
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
    fixture = TestBed.createComponent(AccountsUsersComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', fakeAsync(async () => {
    expect(component).toBeTruthy();
  }));
  function sampleData() {
    const groups = [];
    groups.push({ id: 'group1', name: 'North1', isEnabled: true, labels: [] })
    groups.push({ id: 'group2', name: 'North2', isEnabled: true, labels: [] })
    groups.push({ id: 'group3', name: 'North3', isEnabled: true, labels: [] })

    const user1: User2 = {
      username: 'hamza@ferrumgate.com',
      id: 'someid',
      name: 'hamza',
      source: 'local',
      roleIds: ['Admin'],
      labels: ['test'],
      isLocked: true, isVerified: true,
      is2FA: true,
      insertDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      groupIds: ['group1']

    }
    const user2: User2 = {
      username: 'hamza2@ferrumgate.com',
      id: 'someid2',
      name: 'hamza2',
      source: 'local',
      roleIds: ['Admin'],
      labels: ['test2'],
      isLocked: true, isVerified: true,
      is2FA: true,
      insertDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      groupIds: ['group2']

    }
    const roles = [RBACDefault.roleAdmin, RBACDefault.roleReporter, RBACDefault.roleUser];
    const users = [user1, user2];
    return { groups, users, roles };
  }
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const { groups, users, roles } = sampleData();
    spyOn(httpClient, 'get').and.returnValues(
      of({ items: groups }),
      of({ items: users, total: 2 })
    )
    component.search();
    tick(1000);
    fixture.detectChanges();
    const userElements = findEls(fixture, 'accounts-users-user');
    expect(userElements.length).toBe(2);

  }))

});
