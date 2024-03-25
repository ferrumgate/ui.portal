import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NetworksRoutingModule } from './networks-routing.module';
import { NetworksComponent } from './networks.component';

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
