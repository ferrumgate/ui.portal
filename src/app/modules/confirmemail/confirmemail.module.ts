import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmEmailRoutingModule } from './confirmemail-routing.module';
import { ConfirmEmailComponent } from './confirmemail.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ConfirmEmailComponent],
  imports: [
    CommonModule,
    ConfirmEmailRoutingModule,
    SharedModule
  ]
})
export class ConfirmEmailModule { }
