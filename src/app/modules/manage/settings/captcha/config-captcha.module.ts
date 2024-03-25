import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigCaptchaRoutingModule } from './config-captcha-routing.module';
import { ConfigCaptchaComponent } from './config-captcha.component';

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
