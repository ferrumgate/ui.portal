import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DSettingPasswordComponent } from './dsetting-password.component';


const routes: Routes = [
  {
    path: '',
    component: DSettingPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DSettingPasswordRoutingModule { }
