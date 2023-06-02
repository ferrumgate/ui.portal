import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigFqdnIntelligenceComponent } from './config-fqdn-intelligence.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigFqdnIntelligenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigFqdnIntelligenceRoutingModule { }
