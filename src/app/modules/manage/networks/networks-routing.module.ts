import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NetworksComponent } from './networks.component';



const routes: Routes = [
  {
    path: '',
    component: NetworksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworksRoutingModule { }
