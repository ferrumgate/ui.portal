import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsInviteComponent } from './accounts-invite.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AccountsInviteRoutingModule } from './accounts-invite-routing.module';


@NgModule({
  declarations: [
    AccountsInviteComponent
  ],
  imports: [
    CommonModule,
    AccountsInviteRoutingModule,
    SharedModule
  ]
})
export class AccountsInviteModule { }
