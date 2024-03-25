import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { Group } from 'src/app/modules/shared/models/group';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AccountsGroupsComponent } from './accounts-groups.component';

describe('GroupsComponent', () => {
  let component: AccountsGroupsComponent;
  let fixture: ComponentFixture<AccountsGroupsComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsGroupsComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,
        CaptchaService,
        GroupService,
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
    fixture = TestBed.createComponent(AccountsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let requestCounter = 0;
    const groups: Group[] = [
      { id: 'group1', name: 'group1', isEnabled: true, labels: [] },
      { id: 'group2', name: 'group2', isEnabled: true, labels: [] }
    ];

    const users: any[] = [
      { id: 'user1', name: 'user', username: 'user', groupIds: [groups[0].id] },
      { id: 'user2', name: 'user2', username: 'user2', groupIds: [groups[0].id] }
    ]

    spyOn(httpClient, 'get').and.returnValues(
      of({ items: users }),
      of({ items: groups })
    )
    //load data 
    component.getAllData().subscribe();
    tick(1000);
    fixture.detectChanges();

    const groupElements = findEls(fixture, 'accounts-groups-group');
    expect(groupElements.length).toBe(2);
    component.groups[0].isUsersOpened = true;
    tick(1000);
    fixture.detectChanges();

    const userElements = findEls(fixture, 'accounts-groups-users-item');
    expect(userElements.length).toBe(2);

  }));
});
