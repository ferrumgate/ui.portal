import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/layouts/zero-layout/zero-layout.module').then(m => m.ZeroLayoutModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/layouts/default-layout/default-layout.module').then(m => m.DefaultLayoutModule)

  },
  {
    path: 'user',
    loadChildren: () => import('./modules/layouts/default-layout/default-layout.module').then(m => m.DefaultLayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
