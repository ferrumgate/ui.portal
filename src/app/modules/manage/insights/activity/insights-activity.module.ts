import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { InsightsActivityDetailComponent } from './detail/insights-activity-detail.component';
import { InsightsActivityRoutingModule } from './insights-activity-routing.module';
import { InsightsActivityComponent } from './insights-activity.component';
import { InsightsActivityTableComponent } from './table/insights-activity-table.component';

@NgModule({
  declarations: [
    InsightsActivityComponent,
    InsightsActivityTableComponent,
    InsightsActivityDetailComponent
  ],
  imports: [
    CommonModule,
    InsightsActivityRoutingModule,
    SharedModule
  ]
})
export class InsightsActivityModule { }
