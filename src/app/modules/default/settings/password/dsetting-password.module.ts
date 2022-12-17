import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DSettingPasswordComponent } from './dsetting-password.component';
import { DSettingPasswordRoutingModule } from './dsetting-password-routing.module';




@NgModule({
  declarations: [
    DSettingPasswordComponent
  ],
  imports: [
    CommonModule,
    DSettingPasswordRoutingModule,
    SharedModule
  ]
})
export class DSettingPasswordModule { }
