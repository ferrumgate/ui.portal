import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsightsDeviceComponent } from './insights-device.component';




const routes: Routes = [
  {
    path: '',
    component: InsightsDeviceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsightsDeviceRoutingModule { }
