import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloseWindowRoutingModule } from './closewindow-routing.module';
import { CloseWindowComponent } from './closewindow.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CloseWindowComponent],
  imports: [
    CommonModule,
    CloseWindowRoutingModule,
    SharedModule
  ]
})
export class CloseWindowModule { }
