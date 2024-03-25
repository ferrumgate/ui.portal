import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { DnsRecord } from 'src/app/modules/shared/models/dns';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigDnsComponent } from './config-dns.component';

describe('ConfigDnsComponent', () => {
  let component: ConfigDnsComponent;
  let fixture: ComponentFixture<ConfigDnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigDnsComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService,
        NotificationService,

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    const model: DnsRecord = {
      id: 'p1',
      isEnabled: true,
      labels: ['ab'],
      fqdn: 'www.ferrumgate.com',
      ip: '1.2.3.4'

    }
    component.records = [model]
    tick(1000);
    fixture.detectChanges();
    const locals = findEls(fixture, 'config-dns-item');
    expect(locals.length).toEqual(1);



  }));
});
