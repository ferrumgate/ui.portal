import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
import { RoleGuard } from 'src/app/core/guards/roleGuard';
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
          expectedRole: ['Admin', 'Reporter']
        },
        loadChildren: () => import('../../register/register.module').then(m => m.RegisterModule)

      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLayoutRoutingModule { }
