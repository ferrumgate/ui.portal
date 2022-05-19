import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailConfirmRoutingModule } from './emailconfirm-routing.module';
import { EmailConfirmComponent } from './emailconfirm.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [EmailConfirmComponent],
  imports: [
    CommonModule,
    EmailConfirmRoutingModule,
    SharedModule
  ]
})
export class EmailConfirmModule { }
