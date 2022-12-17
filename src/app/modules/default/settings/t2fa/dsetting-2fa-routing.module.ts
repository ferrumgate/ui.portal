import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DSetting2FAComponent } from './dsetting-2fa.component';


const routes: Routes = [
  {
    path: '',
    component: DSetting2FAComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DSetting2FARoutingModule { }
