import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAuthComponent } from './config-auth.component';

describe('ConfigAuthComponent', () => {
  let component: ConfigAuthComponent;
  let fixture: ComponentFixture<ConfigAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
