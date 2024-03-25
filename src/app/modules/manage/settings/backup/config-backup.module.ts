import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigBackupRoutingModule } from './config-backup-routing.module';
import { ConfigBackupComponent } from './config-backup.component';

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
