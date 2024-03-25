import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureComponent } from './configure.component';

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
