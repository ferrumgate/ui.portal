import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigFqdnIntelligenceRoutingModule } from './config-fqdn-intelligence-routing.module';
import { ConfigFqdnIntelligenceComponent } from './config-fqdn-intelligence.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ConfigFqdnIntelligenceSourceComponent } from './source/config-fqdn-intelligence-source.component';
import { ConfigFqdnIntelligenceListComponent } from './list/config-fqdn-intelligence-list.component';
import { ConfigFqdnIntelligenceListItemComponent } from './listitem/config-fqdn-intelligence-list-item.component';


@NgModule({
  declarations: [
    ConfigFqdnIntelligenceComponent,
    ConfigFqdnIntelligenceSourceComponent,
    ConfigFqdnIntelligenceListComponent,
    ConfigFqdnIntelligenceListItemComponent,
  ],
  imports: [
    CommonModule,
    ConfigFqdnIntelligenceRoutingModule,
    SharedModule
  ]
})
export class ConfigFqdnIntelligenceModule { }
