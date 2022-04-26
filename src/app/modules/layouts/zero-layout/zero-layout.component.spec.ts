import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroLayoutComponent } from './zero-layout.component';

describe('ZeroLayoutComponent', () => {
  let component: ZeroLayoutComponent;
  let fixture: ComponentFixture<ZeroLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
