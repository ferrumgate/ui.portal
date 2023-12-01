import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DSettingProfileComponent } from './dsetting-profile.component';




const routes: Routes = [
  {
    path: '',
    component: DSettingProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DSettingProfileRoutingModule { }
