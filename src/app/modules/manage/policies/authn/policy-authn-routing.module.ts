import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyAuthnComponent } from './policy-authn.component';




const routes: Routes = [
  {
    path: '',
    component: PolicyAuthnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyAuthnRoutingModule { }
