import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLdapComponent } from './auth-ldap.component';

describe('AuthLdapComponent', () => {
  let component: AuthLdapComponent;
  let fixture: ComponentFixture<AuthLdapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthLdapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLdapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
