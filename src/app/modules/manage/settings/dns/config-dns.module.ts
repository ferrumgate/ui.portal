import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigDnsRoutingModule } from './config-dns-routing.module';
import { ConfigDnsComponent } from './config-dns.component';

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
