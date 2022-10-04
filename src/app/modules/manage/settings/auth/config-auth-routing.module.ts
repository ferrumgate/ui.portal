import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigAuthComponent } from './config-auth.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigAuthRoutingModule { }
