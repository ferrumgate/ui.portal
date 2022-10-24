import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyAuthzComponent } from './policy-authz.component';




const routes: Routes = [
  {
    path: '',
    component: PolicyAuthzComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyAuthzRoutingModule { }
