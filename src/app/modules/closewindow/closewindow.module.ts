import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CloseWindowRoutingModule } from './closewindow-routing.module';
import { CloseWindowComponent } from './closewindow.component';

@NgModule({
  declarations: [CloseWindowComponent],
  imports: [
    CommonModule,
    CloseWindowRoutingModule,
    SharedModule
  ]
})
export class CloseWindowModule { }
