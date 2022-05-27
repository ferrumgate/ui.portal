import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreenSwitchRoutingModule } from './screenswitch-routing.module';

import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScreenSwitchComponent } from './screenswitch.component';







@NgModule({
  declarations: [
    ScreenSwitchComponent
  ],
  imports: [
    CommonModule,
    ScreenSwitchRoutingModule,
    SharedModule,

  ]
})
export class ScreenSwitchModule { }
