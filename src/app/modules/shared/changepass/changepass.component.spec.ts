import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, findEl, setFieldValue } from '../helper.spec';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { ChangePassComponent } from './changepass.component';

describe('ChangePass', () => {
  let component: ChangePassComponent;
  let fixture: ComponentFixture<ChangePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePassComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
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
    fixture = TestBed.createComponent(ChangePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();

    component.model = {
      isChanged: false,
      newPass: '',
      newPassAgain: '',
      oldPass: ''
    }

    tick(1000);
    fixture.detectChanges();

    const oldpass = 'changepass-oldpass-input';
    const newpass = 'changepass-newpass-input';
    const newpassAgain = 'changepass-newpass-again-input';

    const testOkButtonId = 'changepass-ok-button';

    expect(component.formGroup.valid).toBeFalse();
    let okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeFalsy();

    setFieldValue(fixture, oldpass, 'Deneme123')
    dispatchFakeEvent(findEl(fixture, oldpass).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeFalse();
    expect(component.formError.oldPass).toBeFalsy();

    setFieldValue(fixture, newpass, 'Deneme1234')
    dispatchFakeEvent(findEl(fixture, newpass).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeFalse();
    expect(component.formError.newPass).toBeFalsy();

    setFieldValue(fixture, newpassAgain, 'Deneme1234')
    dispatchFakeEvent(findEl(fixture, newpassAgain).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.newPassAgain).toBeFalsy();

    okButton = findEl(fixture, testOkButtonId, false);
    expect(okButton).toBeTruthy();

  }));
});

