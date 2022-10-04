import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigCommonComponent } from './config-common.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigCommonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigCommonRoutingModule { }
