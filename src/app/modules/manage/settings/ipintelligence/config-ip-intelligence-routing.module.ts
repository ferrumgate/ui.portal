import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigIpIntelligenceComponent } from './config-ip-intelligence.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigIpIntelligenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigIpIntelligenceRoutingModule { }
