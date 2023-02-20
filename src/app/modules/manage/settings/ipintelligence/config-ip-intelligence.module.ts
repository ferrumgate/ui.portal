import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigIpIntelligenceRoutingModule } from './config-ip-intelligence-routing.module';
import { ConfigIpIntelligenceComponent } from './config-ip-intelligence.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigIpIntelligenceBWListComponent } from './bwlist/config-ip-intelligence-bwlist.component';
import { ConfigIpIntelligenceSourceComponent } from './source/config-ip-intelligence-source.component';
import { ConfigIpIntelligenceBWListItemComponent } from './bwlistitem/config-ip-intelligence-bwlist-item.component';


@NgModule({
  declarations: [
    ConfigIpIntelligenceComponent,
    ConfigIpIntelligenceBWListComponent,
    ConfigIpIntelligenceBWListItemComponent,
    ConfigIpIntelligenceSourceComponent
  ],
  imports: [
    CommonModule,
    ConfigIpIntelligenceRoutingModule,
    SharedModule
  ]
})
export class ConfigIpIntelligenceModule { }
