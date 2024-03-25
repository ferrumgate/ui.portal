import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LogsAuditDetailComponent } from './detail/logs-audit-detail.component';
import { LogsAuditRoutingModule } from './logs-audit-routing.module';
import { LogsAuditComponent } from './logs-audit.component';
import { LogsAuditTableComponent } from './table/logs-audit-table.component';

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
