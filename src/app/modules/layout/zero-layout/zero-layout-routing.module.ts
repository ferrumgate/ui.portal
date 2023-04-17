import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
import { ConfigGuard } from 'src/app/core/guards/configGuard';
import { ConfigureGuard } from 'src/app/core/guards/configureGuard';
import { ZeroLayoutComponent } from './zero-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ZeroLayoutComponent,
    children: [
      {
        canActivate: [ConfigGuard],
        data: {
          config: {
            isEnabledRegister: true
          }
        },
        path: 'register',
        loadChildren: () => import('../../register/register.module').then(m => m.RegisterModule)

      },
      {
        path: 'register/invite',
        loadChildren: () => import('../../registerinvite/registerinvite.module').then(m => m.RegisterInviteModule)

      },
      {
        path: 'login/callback',
        loadChildren: () => import('../../logincallback/logincallback.module').then(m => m.LoginCallbackModule),
      },

      {
        path: 'login',
        loadChildren: () => import('../../login/login.module').then(m => m.LoginModule),
      },
      {
        canActivate: [ConfigGuard],
        data: {
          config: {
            isEnabledRegister: true
          }
        },
        path: 'user/forgotpass',
        loadChildren: () => import('../../forgotpass/forgotpass.module').then(m => m.ForgotPassModule),
      },
      {
        canActivate: [ConfigGuard],
        data: {
          config: {
            isEnabledRegister: true
          }
        },
        path: 'user/resetpass',
        loadChildren: () => import('../../resetpass/resetpass.module').then(m => m.ResetPassModule),
      },
      {
        canActivate: [AuthenticationGuard],
        path: 'user/closewindow',
        loadChildren: () => import('../../closewindow/closewindow.module').then(m => m.CloseWindowModule),
      },
      {
        path: 'pagenotfound',
        loadChildren: () => import('../../pagenotfound/pagenotfound.module').then(m => m.PagenotfoundModule)

      },
      {
        path: 'user/confirmemail',
        loadChildren: () => import('../../confirmemail/confirmemail.module').then(m => m.ConfirmEmailModule)

      },
      {
        path: 'user/confirm2fa',
        loadChildren: () => import('../../confirm2fa/confirm2fa.module').then(m => m.Confirm2FAModule)

      },
      {
        path: 'screenswitch',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('../../screenswitch/screenswitch.module').then(m => m.ScreenSwitchModule)

      },
      {
        path: 'configure',
        canActivate: [AuthenticationGuard, ConfigureGuard],
        loadChildren: () => import('../../configure/configure.module').then(m => m.ConfigureModule)

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
