import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsUsersComponent } from './accounts-users.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsUsersRoutingModule { }
