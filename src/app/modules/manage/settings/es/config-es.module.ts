import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigESRoutingModule } from './config-es-routing.module';
import { ConfigESComponent } from './config-es.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigESComponent
  ],
  imports: [
    CommonModule,
    ConfigESRoutingModule,
    SharedModule
  ]
})
export class ConfigESModule { }
