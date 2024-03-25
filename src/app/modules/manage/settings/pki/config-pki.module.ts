import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigPKIRoutingModule } from './config-pki-routing.module';
import { ConfigPKIComponent } from './config-pki.component';
import { ConfigPKIIntermediateCertComponent } from './intermediatecert/config-pki-intermediate-cert.component';
import { ConfigPKIIntermediateListComponent } from './intermediatelist/config-pki-intermediate-list.component';
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
