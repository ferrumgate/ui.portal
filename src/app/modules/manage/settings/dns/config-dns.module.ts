import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigDnsComponent } from './config-dns.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigDnsRoutingModule } from './config-dns-routing.module';


@NgModule({
  declarations: [
    ConfigDnsComponent,

  ],
  imports: [
    CommonModule,
    ConfigDnsRoutingModule,
    SharedModule
  ]
})
export class ConfigDnsModule { }
