import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { SharedModule } from 'src/app/modules/shared/shared.module';


import { ConfigPKIIntermediateListComponent } from './intermediatelist/config-pki-intermediate-list.component';
import { ConfigPKIIntermediateCertComponent } from './intermediatecert/config-pki-intermediate-cert.component';
import { ConfigPKIComponent } from './config-pki.component';
import { ConfigPKIRoutingModule } from './config-pki-routing.module';
import { ConfigPKIWebComponent } from './web/config-pki-web.component';


@NgModule({
  declarations: [
    ConfigPKIComponent,
    ConfigPKIWebComponent,
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
