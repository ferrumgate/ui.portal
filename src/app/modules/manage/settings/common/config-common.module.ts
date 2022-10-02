import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigCommonRoutingModule } from './config-common-routing.module';
import { ConfigCommonComponent } from './config-common.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


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
