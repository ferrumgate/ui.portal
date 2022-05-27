import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLayoutComponent } from './manage-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { ManageLayoutRoutingModule } from './manage-layout-routing.module';




@NgModule({
  declarations: [
    ManageLayoutComponent
  ],
  imports: [
    CommonModule,
    ManageLayoutRoutingModule,
    SharedModule,
  ]
})
export class ManageLayoutModule { }
