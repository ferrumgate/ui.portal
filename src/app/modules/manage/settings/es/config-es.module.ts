import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigESRoutingModule } from './config-es-routing.module';
import { ConfigESComponent } from './config-es.component';

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
