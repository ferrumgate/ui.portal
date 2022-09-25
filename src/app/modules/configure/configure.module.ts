import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureComponent } from './configure.component';
import { ConfigureRoutingModule } from './configure-routing.module';
import { SharedModule } from '../shared/shared.module';









@NgModule({
  declarations: [
    ConfigureComponent
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    SharedModule,

  ]
})
export class ConfigureModule { }
