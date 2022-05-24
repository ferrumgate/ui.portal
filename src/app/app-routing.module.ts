import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', data: { state: 'app' },
    loadChildren: () => import('./modules/layout/default-layout/default-layout.module').then(m => m.DefaultLayoutModule)

  },
  {
    path: '', data: { state: 'app' },
    loadChildren: () => import('./modules/layout/zero-layout/zero-layout.module').then(m => m.ZeroLayoutModule)

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
