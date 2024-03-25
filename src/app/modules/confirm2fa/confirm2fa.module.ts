import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Confirm2FARoutingModule } from './confirm2fa-routing.module';
import { Confirm2FAComponent } from './confirm2fa.component';

@NgModule({
  declarations: [
    Confirm2FAComponent
  ],
  imports: [
    CommonModule,
    Confirm2FARoutingModule,
    SharedModule,

  ]
})
export class Confirm2FAModule { }
