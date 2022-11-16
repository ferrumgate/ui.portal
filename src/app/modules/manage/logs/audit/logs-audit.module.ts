import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsAuditRoutingModule } from './logs-audit-routing.module';
import { LogsAuditComponent } from './logs-audit.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LogsAuditTableComponent } from './table/logs-audit-table.component';
import { LogsAuditDetailComponent } from './detail/logs-audit-detail.component';





@NgModule({
  declarations: [
    LogsAuditComponent,
    LogsAuditTableComponent,
    LogsAuditDetailComponent
  ],
  imports: [
    CommonModule,
    LogsAuditRoutingModule,
    SharedModule
  ]
})
export class LogsAuditModule { }
