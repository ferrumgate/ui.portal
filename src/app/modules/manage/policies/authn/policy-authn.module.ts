import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PolicyAuthnRoutingModule } from './policy-authn-routing.module';
import { PolicyAuthnComponent } from './policy-authn.component';




@NgModule({
  declarations: [
    PolicyAuthnComponent
  ],
  imports: [
    CommonModule,
    PolicyAuthnRoutingModule,
    SharedModule
  ]
})
export class PolicyAuthnModule { }
