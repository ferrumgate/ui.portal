import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DSettingProfileRoutingModule } from './dsetting-profile-routing.module';
import { DSettingProfileComponent } from './dsetting-profile.component';

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
