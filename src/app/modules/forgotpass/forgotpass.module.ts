import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPassRoutingModule } from './forgotpass-routing.module';
import { ForgotPassComponent } from './forgotpass.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ForgotPassComponent
  ],
  imports: [
    CommonModule,
    ForgotPassRoutingModule,
    SharedModule
  ],
  providers: [

  ]
})
export class ForgotPassModule { }
