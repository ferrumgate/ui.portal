import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZeroLayoutComponent } from './zero-layout.component';

const routes: Routes = [
  {
    path: '', component: ZeroLayoutComponent,
    children: [
      {
        path: "login",
        loadChildren: () => import('../../login/login.module').then(m => m.LoginModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZeroLayoutRoutingModule { }
