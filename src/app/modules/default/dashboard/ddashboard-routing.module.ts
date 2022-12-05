import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DDashboardComponent } from './dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DDashboardRoutingModule { }
