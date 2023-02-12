import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigBackupComponent } from './config-backup.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigBackupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigBackupRoutingModule { }
