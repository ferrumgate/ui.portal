import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigAuthRoutingModule } from './config-auth-routing.module';
import { ConfigAuthComponent } from './config-auth.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigAuthComponent,

  ],
  imports: [
    CommonModule,
    ConfigAuthRoutingModule,
    SharedModule
  ]
})
export class ConfigAuthModule { }
