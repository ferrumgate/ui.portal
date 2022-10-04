import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigCaptchaRoutingModule } from './config-captcha-routing.module';
import { ConfigCaptchaComponent } from './config-captcha.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigCaptchaComponent
  ],
  imports: [
    CommonModule,
    ConfigCaptchaRoutingModule,
    SharedModule
  ]
})
export class ConfigCaptchaModule { }
