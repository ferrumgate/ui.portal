import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RegisterInviteRoutingModule } from './registerinvite-routing.module';
import { RegisterInviteComponent } from './registerinvite.component';

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
