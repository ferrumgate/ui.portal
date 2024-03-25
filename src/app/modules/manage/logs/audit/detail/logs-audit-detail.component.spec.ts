import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { findEls } from 'src/app/modules/shared/helper.spec';
import { MaterialModule } from 'src/app/modules/shared/material-module';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LogsAuditDetailComponent } from './logs-audit-detail.component';

describe('LogsAuditDetailComponent', () => {
  let component: LogsAuditDetailComponent;
  let fixture: ComponentFixture<LogsAuditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsAuditDetailComponent],
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
    fixture = TestBed.createComponent(LogsAuditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });

  it('data binding', fakeAsync(async () => {
    expect(component).toBeTruthy();
    component.rows = ['deneme', 'test2'];
    fixture.detectChanges();
    const els = findEls(fixture, 'logs-audit-detail-list-item');
    expect(els.length).toBe(2);

  }));

});
