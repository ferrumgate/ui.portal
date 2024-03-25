import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginModule } from '../../login/login.module';
import { PagenotfoundModule } from '../../pagenotfound/pagenotfound.module';
import { RegisterModule } from '../../register/register.module';
import { ResetPassModule } from '../../resetpass/resetpass.module';
import { SharedModule } from '../../shared/shared.module';
import { ZeroLayoutRoutingModule } from './zero-layout-routing.module';
import { ZeroLayoutComponent } from './zero-layout.component';

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
