import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigDevicePostureRoutingModule } from './config-deviceposture-routing.module';
import { ConfigDevicePostureComponent } from './config-deviceposture.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigDevicePostureComponent,

  ],
  imports: [
    CommonModule,
    ConfigDevicePostureRoutingModule,
    SharedModule
  ]
})
export class ConfigDevicePostureModule { }
