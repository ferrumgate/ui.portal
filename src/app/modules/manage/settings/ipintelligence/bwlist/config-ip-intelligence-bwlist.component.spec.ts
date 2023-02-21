import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { of } from 'rxjs';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldElementValue, setFieldValue } from 'src/app/modules/shared/helper.spec';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfigureService } from 'src/app/modules/shared/services/configure.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigIpIntelligenceBWListComponent } from './config-ip-intelligence-bwlist.component';



describe('ConfigIpIntelligenceBWListComponent', () => {
  let component: ConfigIpIntelligenceBWListComponent;
  let fixture: ComponentFixture<ConfigIpIntelligenceBWListComponent>;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
  let confirmService: ConfirmService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigIpIntelligenceBWListComponent],
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
    fixture = TestBed.createComponent(ConfigIpIntelligenceBWListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bind model', fakeAsync(async () => {
    expect(component).toBeTruthy();

    component.model.searchData = {
      total: 2,
      items: [
        {
          id: UtilService.randomNumberString(),
          insertDate: new Date().toISOString(),
          val: '1.1.1.1/32',
          description: 'test'
        },
        {
          id: UtilService.randomNumberString(),
          insertDate: new Date().toISOString(),
          val: '1.2.2.2/32',
          description: 'test'
        }
      ]
    }
    component.model.showViewSearch = true;

    tick(1000);
    fixture.detectChanges();
    const elViewSearch = 'config-ip-intelligence-bwlist-viewsearch';
    const elViewAdd = 'config-ip-intelligence-bwlist-viewsave';
    const elViewResults = 'config-ip-intelligence-bwlist-viewresult';

    //check views
    const el1 = findEl(fixture, elViewSearch, false);
    expect(el1).toBeTruthy();
    const el2 = findEl(fixture, elViewAdd, false);
    expect(el2).toBeFalsy();
    const el3 = findEl(fixture, elViewResults, false);
    expect(el3).toBeFalsy();

    const el4 = findEls(fixture, 'config-ip-intelligence-bwlist-item');
    expect(el4.length).toEqual(2);


    //
    component.model.showViewSearch = false;
    component.model.showViewSave = true;
    component.model.showViewSaveResults = false;

    tick(1000);
    fixture.detectChanges();
    //check views
    const el10 = findEl(fixture, elViewSearch, false);
    expect(el10).toBeFalsy();
    const el11 = findEl(fixture, elViewAdd, false);
    expect(el11).toBeTruthy();
    const el12 = findEl(fixture, elViewResults, false);
    expect(el12).toBeFalsy();

    component.saveModel = {
      ips: '1.2.3.4',
      description: 'test', isChanged: false
    }

    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'config-ip-intelligence-bwlist-ips-input', '1.2.3.4');
    expectValue(fixture, 'config-ip-intelligence-bwlist-desc-input', 'test');

    const okButton = findEl(fixture, 'config-ip-intelligence-bwlist-ok-button', false);
    expect(okButton).toBeFalsy();

    setFieldValue(fixture, 'config-ip-intelligence-bwlist-ips-input', '3.4.5.6');
    dispatchFakeEvent(findEl(fixture, 'config-ip-intelligence-bwlist-ips-input').nativeElement, 'blur');

    tick(1000);
    fixture.detectChanges();

    const okButton2 = findEl(fixture, 'config-ip-intelligence-bwlist-ok-button', false);
    expect(okButton2).toBeTruthy();

    // next save results

    component.model.showViewSearch = false;
    component.model.showViewSave = false;
    component.model.showViewSaveResults = true;

    tick(1000);
    fixture.detectChanges();
    //check views
    const el20 = findEl(fixture, elViewSearch, false);
    expect(el20).toBeFalsy();
    const el21 = findEl(fixture, elViewAdd, false);
    expect(el21).toBeFalsy();
    const el22 = findEl(fixture, elViewResults, false);
    expect(el22).toBeTruthy();

    component.model.saveResults = [
      { item: { val: 'abc' } as any }
    ]



    tick(1000);
    fixture.detectChanges();
    const results = findEls(fixture, 'config-ip-intelligence-save-results-item');
    expect(results.length).toEqual(1);


    flush();



  }));
});



