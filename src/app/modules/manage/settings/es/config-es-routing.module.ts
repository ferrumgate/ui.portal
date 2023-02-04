import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigESComponent } from './config-es.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigESComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigESRoutingModule { }
