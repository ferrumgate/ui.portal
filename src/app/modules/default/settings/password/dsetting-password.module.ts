import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DSettingPasswordRoutingModule } from './dsetting-password-routing.module';
import { DSettingPasswordComponent } from './dsetting-password.component';

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
