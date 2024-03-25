import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MDashboardRoutingModule } from './mdashboard-routing.module';
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
