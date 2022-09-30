import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { expectContent, expectText, findEl } from '../helper.spec';
import { MaterialModule } from '../material-module';
import { ConfirmService } from '../services/confirm.service';
import { SharedModule } from '../shared.module';

import { ConfirmComponent } from './confirm.component';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        HttpClientModule, MaterialModule,
        NoopAnimationsModule, SharedModule
      ],
      providers: [TranslateService, ConfigService, MatDialog,
        {
          provide: ConfirmService,
          useValue: {}
        },
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
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });

  it('message title and ui must be ok', () => {

    component.message = 'testmessage';
    component.title = 'testtitle';
    fixture.detectChanges();

    expectText(fixture, 'confirm-title', 'testtitle');


    expectText(fixture, 'confirm-message', 'testmessage');

  });


});
