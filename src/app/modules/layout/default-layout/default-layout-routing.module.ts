import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
import { AuthSourceGuard } from 'src/app/core/guards/authSourceGuard';
import { RoleGuard } from 'src/app/core/guards/roleGuard';
import { RBACDefault } from '../../shared/models/rbac';
import { DefaultLayoutComponent } from './default-layout.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'user/dashboard',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id, RBACDefault.roleUser.id]
        },
        loadChildren: () => import('../../default/dashboard/ddashboard.module').then(m => m.DDashboardModule)

      },
      {
        path: 'user/settings/2fa',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id, RBACDefault.roleUser.id],

        },
        loadChildren: () => import('../../default/settings/t2fa/dsetting-2fa.module').then(m => m.DSetting2FAModule)

      },
      {
        path: 'user/settings/password',
        canActivate: [RoleGuard, AuthSourceGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id, RBACDefault.roleUser.id],
          authSources: ['local-local']
        },
        loadChildren: () => import('../../default/settings/password/dsetting-password.module').then(m => m.DSettingPasswordModule)

      },
      {
        path: 'user/downloads',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id, RBACDefault.roleUser.id],
        },
        loadChildren: () => import('../../default/downloads/downloads.module').then(m => m.DownloadsModule)

      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultLayoutRoutingModule { }
