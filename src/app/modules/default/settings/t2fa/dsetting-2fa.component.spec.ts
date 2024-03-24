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
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { DSetting2FAComponent } from './dsetting-2fa.component';

describe('DSetting2FAComponent', () => {
  let component: DSetting2FAComponent;
  let fixture: ComponentFixture<DSetting2FAComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DSetting2FAComponent],
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
    fixture = TestBed.createComponent(DSetting2FAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();


    spyOn(httpClient, 'get').and.returnValues(
      of({
        is2FA: true, t2FAKey: 'ababab', key: 'blb'
      }),
      of({
        t2FAKey: 'abaddbab', key: 'sfasf'
      }),
    )

    //load data 
    component.getData().subscribe();
    tick(1000);
    fixture.detectChanges();
    expect(component.t2fa.t2FAKey).toBe('ababab');
    const qrcode = findEls(fixture, 'dsetting-2fa-qrcode');
    expect(qrcode.length).toBe(1);

    component.refreshT2FA({});
    tick(1000);
    fixture.detectChanges();
    expect(component.t2faRefresh.t2FAKey).toBe('abaddbab');




  }));
});
