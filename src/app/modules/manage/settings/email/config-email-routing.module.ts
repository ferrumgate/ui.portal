import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigEmailComponent } from './config-email.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigEmailRoutingModule { }
