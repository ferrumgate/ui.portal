import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { checkField, dispatchFakeEvent, expectCheckValue, expectText, expectValue, findEl, findEls, getText, getValue, queryByCss, setFieldValue } from '../helper.spec';
import { Group } from '../models/group';
import { Gateway, Network } from '../models/network';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';


import { FileUploadComponent } from './fileupload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
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
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();


    tick(1000);
    fixture.detectChanges();
    const buf = new ArrayBuffer(5);
    const view = new Uint8Array(buf);
    view.fill(0);

    component.file = new File(['hello'], "test.txt");
    fixture.detectChanges();

    const filename = 'fileipload-filename-input';
    const output = getText(fixture, 'fileupload-filename-input')
    expect(output.trim()).toEqual('test.txt');

    component.uploadProgress = 10;
    tick(1000);
    fixture.detectChanges();
    const el = findEl(fixture, 'fileupload-progress');
    expect(el.componentInstance.value).toEqual(10);



  }));
});

