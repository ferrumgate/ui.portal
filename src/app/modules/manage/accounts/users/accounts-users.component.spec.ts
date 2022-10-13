import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { AccountsUsersComponent } from './accounts-users.component';

describe('AccountsUsersComponent', () => {
  let component: AccountsUsersComponent;
  let fixture: ComponentFixture<AccountsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsUsersComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(async () => {
    expect(component).toBeTruthy();
  }));

});
