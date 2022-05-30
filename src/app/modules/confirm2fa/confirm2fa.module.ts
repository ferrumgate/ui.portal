import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Confirm2FARoutingModule } from './confirm2fa-routing.module';
import { Confirm2FAComponent } from './confirm2fa.component';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';







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
