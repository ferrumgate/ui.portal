import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigDevicePostureComponent } from './config-deviceposture.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigDevicePostureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigDevicePostureRoutingModule { }
