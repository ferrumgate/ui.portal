import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLocalComponent } from './auth-local.component';

describe('AuthLocalComponent', () => {
  let component: AuthLocalComponent;
  let fixture: ComponentFixture<AuthLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
