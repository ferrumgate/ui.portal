import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigBackupRoutingModule } from './config-backup-routing.module';
import { ConfigBackupComponent } from './config-backup.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigBackupComponent
  ],
  imports: [
    CommonModule,
    ConfigBackupRoutingModule,
    SharedModule
  ]
})
export class ConfigBackupModule { }
