import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
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
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: {
          roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id, RBACDefault.roleUser.id]
        },
        loadChildren: () => import('../../default/dashboard/ddashboard.module').then(m => m.DDashboardModule)

      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultLayoutRoutingModule { }
