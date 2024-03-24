import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { MaterialModule } from 'src/app/modules/shared/material-module';
import { ActivityLog } from 'src/app/modules/shared/models/activityLog';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { InsightsActivityDetailComponent } from './insights-activity-detail.component';

describe('InsightsActivityDetailComponent', () => {
  let component: InsightsActivityDetailComponent;
  let fixture: ComponentFixture<InsightsActivityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsightsActivityDetailComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgIdleKeepaliveModule.forRoot(),
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
    fixture = TestBed.createComponent(InsightsActivityDetailComponent);
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
    const els = findEls(fixture, 'insights-activity-detail-table-row');
    expect(els.length).toBe(1);

  }));




});
