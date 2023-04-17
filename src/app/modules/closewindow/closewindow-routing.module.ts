import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CloseWindowComponent } from './closewindow.component';

const routes: Routes = [
  {
    path: '', component: CloseWindowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloseWindowRoutingModule { }
