import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ManageLayoutRoutingModule } from './manage-layout-routing.module';
import { ManageLayoutComponent } from './manage-layout.component';

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
