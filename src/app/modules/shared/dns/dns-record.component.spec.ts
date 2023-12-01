import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { checkField, dispatchFakeEvent, expectCheckValue, expectText, expectValue, findEl, findEls, queryByCss, setFieldValue } from '../helper.spec';
import { Group } from '../models/group';
import { Gateway, Network } from '../models/network';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { DnsRecordComponent } from './dns-record.component';
import { DnsRecord } from '../models/dns';




describe('DnsRecordComponent', () => {
  let component: DnsRecordComponent;
  let fixture: ComponentFixture<DnsRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DnsRecordComponent],
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
    fixture = TestBed.createComponent(DnsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let record: DnsRecord = {
      id: 'recordid', fqdn: 'www.ferrumgate.com', ip: '1.2.3.4', labels: ['test'], isEnabled: true,
    }
    component.dnsRecord = record;
    tick(1000);
    fixture.detectChanges();
    const testFqdnId = 'dns-record-fqdn-input';
    const testIpId = 'dns-record-ip-input';
    const testChipId = 'dns-record-label-chip';
    const testEnabledId = 'dns-record-checkbox-enabled';
    const testOkButtonId = 'dns-record-ok-button';

    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.fqdn).toBeFalsy();
    expect(component.formError.ip).toBeFalsy();

    expectValue(fixture, testFqdnId, record.fqdn);
    expectValue(fixture, testIpId, record.ip);
    //    expectCheckValue(fixture, testEnabledId, true);
    const chips = findEls(fixture, testChipId)
    expect(chips.length).toBe(1);

    setFieldValue(fixture, testFqdnId, '')
    dispatchFakeEvent(findEl(fixture, testFqdnId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();
    expect(component.formError.fqdn).toBeTruthy();
    const button = findEl(fixture, testOkButtonId, false);
    expect(button).toBeUndefined;


    setFieldValue(fixture, testFqdnId, 'www.ferrumgate.com')
    dispatchFakeEvent(findEl(fixture, testFqdnId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.valid).toBeTrue();
    expect(component.formError.fqdn).toBeFalsy();
    const button2 = findEl(fixture, testOkButtonId, false);
    expect(button2).toBeUndefined;
    expect(component.dnsRecord.isChanged).toBeTrue;

    setFieldValue(fixture, testIpId, '')
    dispatchFakeEvent(findEl(fixture, testIpId).nativeElement, 'blur');
    fixture.detectChanges();
    expect(component.formGroup.invalid).toBeTrue();
    expect(component.formError.ip).toBeTruthy();
    const button3 = findEl(fixture, testOkButtonId, false);
    expect(button3).toBeUndefined;


  }));
});

