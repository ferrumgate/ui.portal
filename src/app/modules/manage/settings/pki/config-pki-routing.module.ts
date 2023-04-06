import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigPKIComponent } from './config-pki.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigPKIComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigPKIRoutingModule { }
