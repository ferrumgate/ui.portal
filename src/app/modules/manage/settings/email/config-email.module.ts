import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigEmailRoutingModule } from './config-email-routing.module';
import { ConfigEmailComponent } from './config-email.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [
    ConfigEmailComponent
  ],
  imports: [
    CommonModule,
    ConfigEmailRoutingModule,
    SharedModule
  ]
})
export class ConfigEmailModule { }
