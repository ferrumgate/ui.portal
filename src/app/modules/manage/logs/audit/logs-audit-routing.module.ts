import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsAuditComponent } from './logs-audit.component';




const routes: Routes = [
  {
    path: '',
    component: LogsAuditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsAuditRoutingModule { }
