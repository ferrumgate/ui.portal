import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZeroLayoutComponent } from './zero-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ZeroLayoutComponent,
    children: [
      {
        path: 'register',
        loadChildren: () => import('../../register/register.module').then(m => m.RegisterModule)

      },


      {
        path: 'login',
        loadChildren: () => import('../../login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'pagenotfound',
        loadChildren: () => import('../../pagenotfound/pagenotfound.module').then(m => m.PagenotfoundModule)

      },
      {
        path: 'user/confirm/email/:key',
        loadChildren: () => import('../../emailconfirm/emailconfirm.module').then(m => m.EmailConfirmModule)

      },
      {
        path: '**',
        loadChildren: () => import('../../pagenotfound/pagenotfound.module').then(m => m.PagenotfoundModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZeroLayoutRoutingModule { }