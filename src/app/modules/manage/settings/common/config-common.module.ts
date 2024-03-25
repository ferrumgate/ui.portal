import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigCommonRoutingModule } from './config-common-routing.module';
import { ConfigCommonComponent } from './config-common.component';

@NgModule({
  declarations: [
    ConfigCommonComponent
  ],
  imports: [
    CommonModule,
    ConfigCommonRoutingModule,
    SharedModule
  ]
})
export class ConfigCommonModule { }
