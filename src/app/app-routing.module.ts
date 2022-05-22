import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';
import { OsmComponent } from './page/osm/osm.component';
import { SelectivePreloadingStrategyService } from "./customPreloader.service";

const routes: Routes = [{
  path:'',component:OsmComponent},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  ,data: { preload: true, delay:5000 } }
]

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: SelectivePreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
