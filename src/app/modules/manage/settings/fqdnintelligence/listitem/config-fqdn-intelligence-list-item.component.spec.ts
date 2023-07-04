import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { FqdnIntelligenceList } from 'src/app/modules/shared/models/fqdnIntelligence';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';


import { ConfigFqdnIntelligenceListItemComponent } from './config-fqdn-intelligence-list-item.component';

describe('ConfigFqdnIntelligenceListItemComponent', () => {
  let component: ConfigFqdnIntelligenceListItemComponent;
  let fixture: ComponentFixture<ConfigFqdnIntelligenceListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigFqdnIntelligenceListItemComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
        CaptchaService,
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
    fixture = TestBed.createComponent(ConfigFqdnIntelligenceListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();

    let item: FqdnIntelligenceList = {
      id: 'sv1', name: 'mysql-dev', labels: ['test'], isEnabled: true,
      insertDate: '01.01.01', updateDate: ''
    }
    component.list = item;

    tick(1000);
    fixture.detectChanges();

    const testChipId = 'list-label-chip';

    const testOkButtonId = 'list-ok-button';

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.name).toBeFalsy();

    expectValue(fixture, 'list-name-input', item.name);
    expectValue(fixture, 'list-insertdate-input', '2001-01-01 00:00:00');

    item.http = {
      url: 'https://ferrumgate.com', checkFrequency: 10
    }

    component.list = item;
    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'list-http-url-input', item.http.url);
    expectValue(fixture, 'list-http-check-frequency-hours', '10');
    expect(component.formGroup.valid).toBeTrue;

    //set name to empty
    setFieldValue(fixture, 'list-name-input', '')
    dispatchFakeEvent(findEl(fixture, 'list-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();

    setFieldValue(fixture, 'list-name-input', 'test')
    dispatchFakeEvent(findEl(fixture, 'list-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();


    //set url invalid
    setFieldValue(fixture, 'list-http-url-input', 'abcd')
    dispatchFakeEvent(findEl(fixture, 'list-http-url-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();

    //set file option again



    item.http = undefined;
    item.file = { source: 'abc.txt' }
    component.list = item;
    tick(1000);
    fixture.detectChanges();

    const fileuploadEl = findEl(fixture, 'list-fileupload', false);
    expect(fileuploadEl).toBeTruthy();

    //check change
    //set name to else
    setFieldValue(fixture, 'list-name-input', 'abcded')
    dispatchFakeEvent(findEl(fixture, 'list-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.list.isChanged).toBeTrue;

    //set status

    item.http = undefined;
    item.file = { source: 'abc.txt' }
    item.status = {
      lastCheck: '01.01.01',
      lastError: 'an error',
      hasFile: true
    }
    component.list = item;
    tick(1000);
    fixture.detectChanges();


    expectValue(fixture, 'list-status-check-input', '01.01.01');
    expectValue(fixture, 'list-status-input', 'an error');

    const downloadEl = findEl(fixture, 'download-button', false);
    expect(downloadEl).toBeTruthy();


  }));
});

