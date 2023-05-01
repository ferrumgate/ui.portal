import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { MaterialModule } from 'src/app/modules/shared/material-module';

import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';



import { InsightsDeviceDetailComponent } from './insights-device-detail.component';

describe('InsightsDeviceDetailComponent', () => {
  let component: InsightsDeviceDetailComponent;
  let fixture: ComponentFixture<InsightsDeviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsDeviceDetailComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        HttpClientModule, MaterialModule,
        NoopAnimationsModule, SharedModule
      ],
      providers: [TranslateService, ConfigService, MatDialog,

        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsDeviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.dataSource = [{ key: 'id', value: '1' }];
    fixture.detectChanges();
    const els = findEls(fixture, 'insights-device-detail-table-row');
    expect(els.length).toBe(1);

  }));




});
