import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DownloadsRoutingModule } from './downloads-routing.module';
import { DownloadsComponent } from './downloads.component';





@NgModule({
  declarations: [
    DownloadsComponent
  ],
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    SharedModule
  ]
})
export class DownloadsModule { }
