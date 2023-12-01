import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DSettingProfileComponent } from './dsetting-profile.component';
import { DSettingProfileRoutingModule } from './dsetting-profile-routing.module';




@NgModule({
  declarations: [
    DSettingProfileComponent
  ],
  imports: [
    CommonModule,
    DSettingProfileRoutingModule,
    SharedModule
  ]
})
export class DSettingProfileModule { }
