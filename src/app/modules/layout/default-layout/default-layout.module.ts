import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './default-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { DefaultLayoutRoutingModule } from './default-layout-routing.module';




@NgModule({
  declarations: [
    DefaultLayoutComponent
  ],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule,
    SharedModule,
  ]
})
export class DefaultLayoutModule { }
