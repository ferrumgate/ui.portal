import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigCaptchaComponent } from './config-captcha.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigCaptchaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigCaptchaRoutingModule { }
