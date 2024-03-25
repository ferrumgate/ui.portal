import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AccountsInviteRoutingModule } from './accounts-invite-routing.module';
import { AccountsInviteComponent } from './accounts-invite.component';

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
