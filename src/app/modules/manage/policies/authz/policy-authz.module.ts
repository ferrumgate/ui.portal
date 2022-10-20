import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PolicyAuthzComponent } from './policy-authz.component';
import { PolicyAuthzRoutingModule } from './policy-authz-routing.module';




@NgModule({
  declarations: [
    PolicyAuthzComponent
  ],
  imports: [
    CommonModule,
    PolicyAuthzRoutingModule,
    SharedModule
  ]
})
export class PolicyAuthzModule { }
