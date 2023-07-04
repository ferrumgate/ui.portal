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
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id]
        },
        loadChildren: () => import('../../manage/dashboard/mdashboard.module').then(m => m.MDashboardModule)

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
        path: 'accounts/invite',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/accounts/invite/accounts-invite.module').then(m => m.AccountsInviteModule)

      },
      {
        path: 'services',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/services/services.module').then(m => m.ServicesModule)

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
        path: 'settings/brand',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/brand/config-brand.module').then(m => m.ConfigBrandModule)

      },
      {
        path: 'policies/authn',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/policies/authn/policy-authn.module').then(m => m.PolicyAuthnModule)

      },
      {
        path: 'policies/authz',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/policies/authz/policy-authz.module').then(m => m.PolicyAuthzModule)

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
      {
        path: 'settings/es',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/es/config-es.module').then(m => m.ConfigESModule)

      },
      {
        path: 'settings/backup',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/backup/config-backup.module').then(m => m.ConfigBackupModule)

      },
      {
        path: 'settings/ip/intelligence',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/ipintelligence/config-ip-intelligence.module').then(m => m.ConfigIpIntelligenceModule)

      },
      {
        path: 'settings/fqdn/intelligence',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/fqdnintelligence/config-fqdn-intelligence.module').then(m => m.ConfigFqdnIntelligenceModule)

      },
      {
        path: 'settings/pki',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/pki/config-pki.module').then(m => m.ConfigPKIModule)

      },
      {
        path: 'settings/device/posture',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/settings/deviceposture/config-deviceposture.module').then(m => m.ConfigDevicePostureModule)

      },
      {
        path: 'logs/audit',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id]
        },
        loadChildren: () => import('../../manage/logs/audit/logs-audit.module').then(m => m.LogsAuditModule)

      },
      {
        path: 'insights/activity',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id]
        },
        loadChildren: () => import('../../manage/insights/activity/insights-activity.module').then(m => m.InsightsActivityModule)

      },
      {
        path: 'insights/device',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id]
        },
        loadChildren: () => import('../../manage/insights/device/insights-device.module').then(m => m.InsightsDeviceModule)

      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLayoutRoutingModule { }
