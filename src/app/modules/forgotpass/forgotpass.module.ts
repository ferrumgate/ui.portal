import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ForgotPassRoutingModule } from './forgotpass-routing.module';
import { ForgotPassComponent } from './forgotpass.component';

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
