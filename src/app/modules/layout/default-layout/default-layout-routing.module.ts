import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/guards/authenticationGuard';
import { RoleGuard } from 'src/app/core/guards/roleGuard';
import { DefaultLayoutComponent } from './default-layout.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: {
          expectedRole: ''
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
export class DefaultLayoutRoutingModule { }
