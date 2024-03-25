import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ConfirmEmailRoutingModule } from './confirmemail-routing.module';
import { ConfirmEmailComponent } from './confirmemail.component';

@NgModule({
  declarations: [ConfirmEmailComponent],
  imports: [
    CommonModule,
    ConfirmEmailRoutingModule,
    SharedModule
  ]
})
export class ConfirmEmailModule { }
