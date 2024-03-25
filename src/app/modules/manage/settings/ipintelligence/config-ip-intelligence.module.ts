import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigIpIntelligenceRoutingModule } from './config-ip-intelligence-routing.module';
import { ConfigIpIntelligenceComponent } from './config-ip-intelligence.component';
import { ConfigIpIntelligenceListComponent } from './list/config-ip-intelligence-list.component';
import { ConfigIpIntelligenceListItemComponent } from './listitem/config-ip-intelligence-list-item.component';
import { ConfigIpIntelligenceSourceComponent } from './source/config-ip-intelligence-source.component';

@NgModule({
  declarations: [
    ConfigIpIntelligenceComponent,
    ConfigIpIntelligenceSourceComponent,
    ConfigIpIntelligenceListComponent,
    ConfigIpIntelligenceListItemComponent,
  ],
  imports: [
    CommonModule,
    ConfigIpIntelligenceRoutingModule,
    SharedModule
  ]
})
export class ConfigIpIntelligenceModule { }
