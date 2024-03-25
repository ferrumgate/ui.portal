import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ResetPassRoutingModule } from './resetpass-routing.module';
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
