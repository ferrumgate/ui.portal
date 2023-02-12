import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsInviteComponent } from './accounts-invite.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsInviteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsInviteRoutingModule { }
