import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NodesRoutingModule } from './nodes-routing.module';
import { NodesComponent } from './nodes.component';

@NgModule({
  declarations: [
    NodesComponent
  ],
  imports: [
    CommonModule,
    NodesRoutingModule,
    SharedModule,

  ]
})
export class NodesModule { }
