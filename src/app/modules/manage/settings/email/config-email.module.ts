import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigEmailRoutingModule } from './config-email-routing.module';
import { ConfigEmailComponent } from './config-email.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigEmailExternalComponent } from './custom/config-email-external.component';




@NgModule({
  declarations: [
    ConfigEmailComponent,
    ConfigEmailExternalComponent
  ],
  imports: [
    CommonModule,
    ConfigEmailRoutingModule,
    SharedModule
  ]
})
export class ConfigEmailModule { }
