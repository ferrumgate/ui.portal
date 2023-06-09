import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZeroLayoutRoutingModule } from './zero-layout-routing.module';
import { ZeroLayoutComponent } from './zero-layout.component';
import { LoginModule } from '../../login/login.module';
import { PagenotfoundModule } from '../../pagenotfound/pagenotfound.module';

import { ResetPassModule } from '../../resetpass/resetpass.module';
import { RegisterModule } from '../../register/register.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [ZeroLayoutComponent],
  imports: [
    CommonModule,
    ZeroLayoutRoutingModule,
    SharedModule,
    LoginModule,
    PagenotfoundModule,
    RegisterModule,
    ResetPassModule
  ]
})
export class ZeroLayoutModule { }
