import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigDnsComponent } from './config-dns.component';


const routes: Routes = [
  {
    path: '',
    component: ConfigDnsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigDnsRoutingModule { }
