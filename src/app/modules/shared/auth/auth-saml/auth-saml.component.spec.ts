import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSamlComponent } from './auth-saml.component';

describe('AuthSamlComponent', () => {
  let component: AuthSamlComponent;
  let fixture: ComponentFixture<AuthSamlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthSamlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
