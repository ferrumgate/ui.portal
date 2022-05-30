import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginCallbackRoutingModule } from './logincallback-routing.module';
import { LoginCallbackComponent } from './logincallback.component';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';







@NgModule({
  declarations: [
    LoginCallbackComponent
  ],
  imports: [
    CommonModule,
    LoginCallbackRoutingModule,
    SharedModule,

  ]
})
export class LoginCallbackModule { }
