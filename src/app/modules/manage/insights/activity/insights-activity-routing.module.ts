import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsightsActivityComponent } from './insights-activity.component';




const routes: Routes = [
  {
    path: '',
    component: InsightsActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsightsActivityRoutingModule { }
