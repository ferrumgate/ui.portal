import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCaptchaComponent } from './config-captcha.component';

describe('ConfigCaptchaComponent', () => {
  let component: ConfigCaptchaComponent;
  let fixture: ComponentFixture<ConfigCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigCaptchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
