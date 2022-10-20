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



import { PolicyAuthzComponent } from './policy-authz.component';

describe('ServicesComponent', () => {
  let component: PolicyAuthzComponent;
  let fixture: ComponentFixture<PolicyAuthzComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolicyAuthzComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,
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
    fixture = TestBed.createComponent(PolicyAuthzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    let requestCounter = 0;
    const networks: Network[] = [
      {
        id: '312', name: 'ops3', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

        clientNetwork: '1.2.3.4/24'
      }

    ];

    const services: Service[] = [
      {
        id: UtilService.randomNumberString(), name: 'mysql-dev', host: '10.0.0.2', assignedIp: '',
        isEnabled: true, networkId: networks[0].id, protocol: 'raw', tcp: 80, udp: 90
      },
      {
        id: UtilService.randomNumberString(), name: 'mysql2-dev2', host: '10.0.0.2', assignedIp: '',
        isEnabled: true, networkId: networks[0].id, protocol: 'raw', tcp: 80, udp: 90
      }
    ]

    spyOn(httpClient, 'get').and.returnValues(
      of({ items: networks }),
      of({ items: services })
    )
    //load data 
    component.getAllData().subscribe();
    tick(1000);
    fixture.detectChanges();

    const serviceElements = findEls(fixture, 'services-service');
    expect(serviceElements.length).toBe(2);




  })); */
});
