import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { map, of } from 'rxjs';
import { findEl, findEls } from 'src/app/modules/shared/helper.spec';
import { Group } from 'src/app/modules/shared/models/group';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';




import { DSettingProfileComponent } from './dsetting-profile.component';
import { UserService } from 'src/app/modules/shared/services/user.service';

describe('DSettingUProfileComponent', () => {
  let component: DSettingProfileComponent;
  let fixture: ComponentFixture<DSettingProfileComponent>;
  let httpClient: HttpClient;
  let userService: UserService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DSettingProfileComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,
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
    fixture = TestBed.createComponent(DSettingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
    userService = TestBed.inject(UserService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();


    spyOn(userService, 'getCurrentUserProfile').and.returnValue(
      of({
        browserTimeout: 511
      }),
    )

    //load data 
    component.getData().subscribe();
    tick(1000);
    fixture.detectChanges();
    expect(component.model.browserTimeout).toBe(511);


  }));
});
