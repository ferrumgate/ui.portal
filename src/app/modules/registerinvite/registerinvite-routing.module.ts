import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterInviteComponent } from './registerinvite.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterInviteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterInviteRoutingModule { }
