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
        //canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id]
        },
        loadChildren: () => import('../../manage/networks/networks.module').then(m => m.NetworksModule)

      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLayoutRoutingModule { }
