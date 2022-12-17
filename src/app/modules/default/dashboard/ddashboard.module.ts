import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DDashboardRoutingModule } from './ddashboard-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DDashboardComponent } from './ddashboard.component';



@NgModule({
  declarations: [
    DDashboardComponent
  ],
  imports: [
    CommonModule,
    DDashboardRoutingModule,
    SharedModule
  ]
})
export class DDashboardModule { }
