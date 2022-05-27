import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSwitchComponent } from './screenswitch.component';

describe('ScreenswitchComponent', () => {
  let component: ScreenSwitchComponent;
  let fixture: ComponentFixture<ScreenSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenSwitchComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
