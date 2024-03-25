import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AccountsUsersRoutingModule } from './accounts-users-routing.module';
import { AccountsUsersComponent } from './accounts-users.component';

@NgModule({
  declarations: [
    AccountsUsersComponent
  ],
  imports: [
    CommonModule,
    AccountsUsersRoutingModule,
    SharedModule
  ]
})
export class AccountsUsersModule { }
