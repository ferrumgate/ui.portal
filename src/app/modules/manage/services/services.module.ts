import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsGroupsRoutingModule } from './services-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ServicesComponent } from './services.component';



@NgModule({
  declarations: [
    ServicesComponent
  ],
  imports: [
    CommonModule,
    AccountsGroupsRoutingModule,
    SharedModule
  ]
})
export class ServicesModule { }
