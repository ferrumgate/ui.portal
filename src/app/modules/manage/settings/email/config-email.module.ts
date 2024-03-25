import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigEmailAWSComponent } from './aws/config-email-aws.component';
import { ConfigEmailRoutingModule } from './config-email-routing.module';
import { ConfigEmailComponent } from './config-email.component';
import { ConfigEmailExternalComponent } from './custom/config-email-external.component';
import { ConfigEmailSmtpComponent } from './smtp/config-email-smtp.component';

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
