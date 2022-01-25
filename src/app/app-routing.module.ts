import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },

  {
    path: 'home',
    loadChildren: () =>
      import('./tab1/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./tab2/create.module').then((m) => m.CreatePageModule),
  },

  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./detail/detail.module').then((m) => m.DetailPageModule),
  },
  {
    path: 'record',
    loadChildren: () =>
      import('./tab3/audio.module').then((m) => m.AudioPageModule),
  },
  {
    path: 'record/:id',
    loadChildren: () =>
      import('./record/record.module').then((m) => m.RecordModule),
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
