import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfirmComponent } from './emailconfirm.component';

const routes: Routes = [
  {
    path: '', component: EmailConfirmComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailConfirmRoutingModule { }
