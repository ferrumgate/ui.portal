import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PolicyAuthzRoutingModule } from './policy-authz-routing.module';
import { PolicyAuthzComponent } from './policy-authz.component';

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
