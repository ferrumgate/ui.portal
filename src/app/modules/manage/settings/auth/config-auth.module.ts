import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigAuthRoutingModule } from './config-auth-routing.module';
import { ConfigAuthComponent } from './config-auth.component';

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
