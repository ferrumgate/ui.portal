import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MDashboardRoutingModule } from './mdashboard-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MDashboardComponent } from './mdashboard.component';



@NgModule({
  declarations: [
    MDashboardComponent
  ],
  imports: [
    CommonModule,
    MDashboardRoutingModule,
    SharedModule
  ]
})
export class MDashboardModule { }
