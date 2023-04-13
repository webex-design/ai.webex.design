import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectComponent } from './collect.component';

const routes: Routes = [{
  path: '',
  component: CollectComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectRoutingModule { }
