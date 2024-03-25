import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InsightsDeviceDetailComponent } from './detail/insights-device-detail.component';
import { InsightsDeviceRoutingModule } from './insights-device-routing.module';
import { InsightsDeviceComponent } from './insights-device.component';
import { InsightsDeviceTableComponent } from './table/insights-device-table.component';

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
