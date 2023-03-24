import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandDrawIconComponent } from './hand-draw-icon.component';

const routes: Routes = [ {
  path: '',
  component: HandDrawIconComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandDrawIconRoutingModule { }
