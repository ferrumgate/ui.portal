import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginCallbackRoutingModule } from './logincallback-routing.module';
import { LoginCallbackComponent } from './logincallback.component';

@NgModule({
  declarations: [
    LoginCallbackComponent
  ],
  imports: [
    CommonModule,
    LoginCallbackRoutingModule,
    SharedModule,

  ]
})
export class LoginCallbackModule { }
