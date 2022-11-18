import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightsActivityRoutingModule } from './insights-activity-routing.module';

import { SharedModule } from 'src/app/modules/shared/shared.module';

import { InsightsActivityComponent } from './insights-activity.component';
import { InsightsActivityTableComponent } from './table/insights-activity-table.component';
import { InsightsActivityDetailComponent } from './detail/insights-activity-detail.component';





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
