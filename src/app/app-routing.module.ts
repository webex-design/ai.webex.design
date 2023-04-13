import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [{
  path: '',
  loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  data: { navIndex: 1 }
},{
  path: 'draft',
  loadChildren: () => import('./draft/draft.module').then(m => m.DraftModule),
  data: { navIndex: 2 }
},{
  path: 'demo',
  loadChildren: () => import('./demo/demo.module').then(m => m.DemoModule),
  data: { navIndex: 3 }
},{
  path: 'collect',
  loadChildren: () => import('./collect/collect.module').then(m => m.CollectModule),
},{
  path: 'under-construction',
  loadChildren: () => import('./under-construction/under-construction.module').then(m => m.UnderConstructionModule)
}];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy:PreloadAllModules,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
