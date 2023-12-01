import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigEmailRoutingModule } from './config-email-routing.module';
import { ConfigEmailComponent } from './config-email.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigEmailExternalComponent } from './custom/config-email-external.component';
import { ConfigEmailSmtpComponent } from './smtp/config-email-smtp.component';
import { ConfigEmailAWSComponent } from './aws/config-email-aws.component';



@NgModule({
  declarations: [
    ConfigEmailComponent,
    ConfigEmailExternalComponent,
    ConfigEmailSmtpComponent,
    ConfigEmailAWSComponent
  ],
  imports: [
    CommonModule,
    ConfigEmailRoutingModule,
    SharedModule
  ]
})
export class ConfigEmailModule { }
