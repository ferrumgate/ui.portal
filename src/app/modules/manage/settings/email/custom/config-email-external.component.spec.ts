import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEmailExternalComponent } from './config-email-external.component';

describe('ConfigEmailGmailComponent', () => {
  let component: ConfigEmailExternalComponent;
  let fixture: ComponentFixture<ConfigEmailExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigEmailExternalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEmailExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
