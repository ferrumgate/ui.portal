import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ScreenSwitchRoutingModule } from './screenswitch-routing.module';
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
