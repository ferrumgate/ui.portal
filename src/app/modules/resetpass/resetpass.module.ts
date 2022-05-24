import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPassRoutingModule } from './resetpass-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ResetPassComponent } from './resetpass.component';



@NgModule({
  declarations: [
    ResetPassComponent
  ],
  imports: [
    CommonModule,
    ResetPassRoutingModule,
    SharedModule
  ]
})
export class ResetPassModule { }
