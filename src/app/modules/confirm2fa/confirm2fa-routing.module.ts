import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Confirm2FAComponent } from './confirm2fa.component';

const routes: Routes = [
  {
    path: '',
    component: Confirm2FAComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Confirm2FARoutingModule { }
