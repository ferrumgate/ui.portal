import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigBrandRoutingModule } from './config-brand-routing.module';
import { ConfigBrandComponent } from './config-brand.component';

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
