import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo.component';

const routes: Routes = [  {
  path: '',
  component: DemoComponent
},{
  path: 'hand-draw-icon',
  loadChildren: () => import('./hand-draw-icon/hand-draw-icon.module').then(m => m.HandDrawIconModule),
  data: { navIndex: 2 }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
