import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { of } from 'rxjs';
import { click, dispatchFakeEvent, findEl, getValue, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigBackupComponent } from './config-backup.component';

describe('ConfigBackupComponent', () => {
  let component: ConfigBackupComponent;
  let fixture: ComponentFixture<ConfigBackupComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  let configService: ConfigService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigBackupComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
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
    configService = TestBed.inject(ConfigService);
    fixture = TestBed.createComponent(ConfigBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();

    tick(1000);
    fixture.detectChanges();
    spyOn(configService, 'export').and.returnValue(of({ key: 'abc' }));

    tick(1000);
    fixture.detectChanges();
    //clieck export button
    click(fixture, 'config-backup-export-button');
    tick(1000);
    fixture.detectChanges();
    //get export key value
    const val = getValue(fixture, 'backup-export-key-input')
    expect(val).toEqual('abc');

    //check import key input exists
    const importEl = findEl(fixture, 'backup-import-key-input', false)
    expect(importEl).toBeFalsy();

    //click import button
    click(fixture, 'config-backup-import-button');
    tick(1000);
    fixture.detectChanges();

    // check export key input
    const exportEl = findEl(fixture, 'backup-export-key-input', false)
    expect(exportEl).toBeFalsy();

    //set value
    setFieldValue(fixture, 'backup-import-key-input', 'akey');
    dispatchFakeEvent(findEl(fixture, 'backup-import-key-input').nativeElement, 'blur');
    tick(1000);
    fixture.detectChanges();

    const fileupload = findEl(fixture, 'backup-import-fileupload', false);
    expect(fileupload).toBeTruthy();

    flush();

  }));
});

