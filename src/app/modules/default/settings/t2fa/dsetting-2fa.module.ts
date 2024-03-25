import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DSetting2FARoutingModule } from './dsetting-2fa-routing.module';
import { DSetting2FAComponent } from './dsetting-2fa.component';

@NgModule({
  declarations: [
    DSetting2FAComponent
  ],
  imports: [
    CommonModule,
    DSetting2FARoutingModule,
    SharedModule
  ]
})
export class DSetting2FAModule { }
