import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NodesComponent } from './nodes.component';



const routes: Routes = [
  {
    path: '',
    component: NodesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodesRoutingModule { }
