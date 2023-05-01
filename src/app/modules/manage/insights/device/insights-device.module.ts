import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InsightsDeviceRoutingModule } from './insights-device-routing.module';
import { InsightsDeviceDetailComponent } from './detail/insights-device-detail.component';
import { InsightsDeviceTableComponent } from './table/insights-device-table.component';
import { InsightsDeviceComponent } from './insights-device.component';







@NgModule({
  declarations: [
    InsightsDeviceComponent,
    InsightsDeviceTableComponent,
    InsightsDeviceDetailComponent
  ],
  imports: [
    CommonModule,
    InsightsDeviceRoutingModule,
    SharedModule
  ]
})
export class InsightsDeviceModule { }
