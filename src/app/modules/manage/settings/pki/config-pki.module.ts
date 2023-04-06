import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ConfigIpIntelligenceSourceComponent } from './source/config-ip-intelligence-source.component';
import { ConfigPKIIntermediateListComponent } from './intermediatelist/config-pki-intermediate-list.component';
import { ConfigPKIIntermediateCertComponent } from './intermediatecert/config-pki-intermediate-cert.component';
import { ConfigPKIComponent } from './config-pki.component';
import { ConfigPKIRoutingModule } from './config-pki-routing.module';


@NgModule({
  declarations: [
    ConfigPKIComponent,
    ConfigIpIntelligenceSourceComponent,
    ConfigPKIIntermediateListComponent,
    ConfigPKIIntermediateCertComponent,
  ],
  imports: [
    CommonModule,
    ConfigPKIRoutingModule,
    SharedModule
  ]
})
export class ConfigPKIModule { }
