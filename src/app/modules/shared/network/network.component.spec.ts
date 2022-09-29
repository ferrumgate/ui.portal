import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { ConfigService } from '../services/config.service';
import { SharedModule } from '../shared.module';

import { NetworkComponent } from './network.component';

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let fixture: ComponentFixture<NetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ConfigService, useValue: {} }, TranslateService


      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
