import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../../shared/shared.module';
import { NetworksComponent } from './networks.component';
import { NetworksRoutingModule } from './networks-routing.module';









@NgModule({
  declarations: [
    NetworksComponent
  ],
  imports: [
    CommonModule,
    NetworksRoutingModule,
    SharedModule,

  ]
})
export class NetworksModule { }
