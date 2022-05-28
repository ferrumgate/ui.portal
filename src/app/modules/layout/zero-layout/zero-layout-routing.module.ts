import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
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
        path: 'user/forgotpass',
        loadChildren: () => import('../../forgotpass/forgotpass.module').then(m => m.ForgotPassModule),
      },
      {
        path: 'user/resetpass',
        loadChildren: () => import('../../resetpass/resetpass.module').then(m => m.ResetPassModule),
      },
      {
        path: 'pagenotfound',
        loadChildren: () => import('../../pagenotfound/pagenotfound.module').then(m => m.PagenotfoundModule)

      },
      {
        path: 'user/emailconfirm',
        loadChildren: () => import('../../emailconfirm/emailconfirm.module').then(m => m.EmailConfirmModule)

      },
      {
        path: 'screenswitch',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../screenswitch/screenswitch.module').then(m => m.ScreenSwitchModule)

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
