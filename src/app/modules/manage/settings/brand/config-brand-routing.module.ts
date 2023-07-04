import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigBrandComponent } from './config-brand.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigBrandComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigBrandRoutingModule { }
