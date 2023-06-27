import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigBrandRoutingModule } from './config-brand-routing.module';
import { ConfigBrandComponent } from './config-brand.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigBrandComponent
  ],
  imports: [
    CommonModule,
    ConfigBrandRoutingModule,
    SharedModule
  ]
})
export class ConfigBrandModule { }
