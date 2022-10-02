import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigEmailComponent } from './config-email.component';

describe('ConfigEmailComponent', () => {
  let component: ConfigEmailComponent;
  let fixture: ComponentFixture<ConfigEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
