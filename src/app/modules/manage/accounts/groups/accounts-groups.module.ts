import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AccountsGroupsRoutingModule } from './accounts-groups-routing.module';
import { AccountsGroupsComponent } from './accounts-groups.component';

@NgModule({
  declarations: [
    AccountsGroupsComponent
  ],
  imports: [
    CommonModule,
    AccountsGroupsRoutingModule,
    SharedModule
  ]
})
export class AccountsGroupsModule { }
