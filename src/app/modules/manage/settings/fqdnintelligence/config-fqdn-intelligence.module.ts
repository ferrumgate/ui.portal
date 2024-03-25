import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigFqdnIntelligenceRoutingModule } from './config-fqdn-intelligence-routing.module';
import { ConfigFqdnIntelligenceComponent } from './config-fqdn-intelligence.component';
import { ConfigFqdnIntelligenceListComponent } from './list/config-fqdn-intelligence-list.component';
import { ConfigFqdnIntelligenceListItemComponent } from './listitem/config-fqdn-intelligence-list-item.component';
import { ConfigFqdnIntelligenceSourceComponent } from './source/config-fqdn-intelligence-source.component';

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
