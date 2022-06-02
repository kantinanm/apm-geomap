import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';
import { OsmComponent } from './page/osm/osm.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './login/login.component';
import { SelectivePreloadingStrategyService } from "./customPreloader.service";

const routes: Routes = [{
  path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:OsmComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: SelectivePreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
