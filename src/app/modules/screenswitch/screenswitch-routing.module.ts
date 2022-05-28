import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenSwitchComponent } from './screenswitch.component';


const routes: Routes = [
  {
    path: '',
    component: ScreenSwitchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreenSwitchRoutingModule { }
