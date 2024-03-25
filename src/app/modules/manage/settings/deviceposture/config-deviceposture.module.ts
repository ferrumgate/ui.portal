import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigDevicePostureRoutingModule } from './config-deviceposture-routing.module';
import { ConfigDevicePostureComponent } from './config-deviceposture.component';

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
