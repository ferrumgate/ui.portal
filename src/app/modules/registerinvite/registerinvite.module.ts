import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterInviteRoutingModule } from './registerinvite-routing.module';
import { RegisterInviteComponent } from './registerinvite.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    RegisterInviteComponent
  ],
  imports: [
    CommonModule,
    RegisterInviteRoutingModule,
    SharedModule
  ],
  providers: [

  ]
})
export class RegisterInviteModule { }
