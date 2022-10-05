import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthOauthComponent } from './auth-oauth.component';

describe('AuthOauthComponent', () => {
  let component: AuthOauthComponent;
  let fixture: ComponentFixture<AuthOauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthOauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
