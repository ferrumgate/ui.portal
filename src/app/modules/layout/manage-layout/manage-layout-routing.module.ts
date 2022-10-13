import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
import { RoleGuard } from 'src/app/core/guards/roleGuard';
import { RBACDefault } from '../../shared/models/rbac';
import { ManageLayoutComponent } from './manage-layout.component';


const routes: Routes = [
  {
    path: '',
    component: ManageLayoutComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../register/register.module').then(m => m.RegisterModule)

      },
      {
        path: 'networks',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/networks/networks.module').then(m => m.NetworksModule)

      },
      {
        path: 'accounts/users',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/accounts/users/accounts-users.module').then(m => m.AccountsUsersModule)

      },
      {
        path: 'accounts/groups',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/accounts/groups/accounts-groups.module').then(m => m.AccountsGroupsModule)

      },
      {
        path: 'settings/common',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/common/config-common.module').then(m => m.ConfigCommonModule)

      },
      {
        path: 'settings/email',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/email/config-email.module').then(m => m.ConfigEmailModule)

      },
      {
        path: 'settings/captcha',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/captcha/config-captcha.module').then(m => m.ConfigCaptchaModule)

      },
      {
        path: 'settings/auth',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/auth/config-auth.module').then(m => m.ConfigAuthModule)

      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLayoutRoutingModule { }
