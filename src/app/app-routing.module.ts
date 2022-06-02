import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';
import { OsmComponent } from './page/osm/osm.component';
import { HomeComponent } from './page/home/home.component';
import { OverallComponent } from './page/report/overall/overall.component';
import { OverallProvinceComponent } from './page/report/overall-province/overall-province.component';
import { LoginComponent } from './login/login.component';
import { SelectivePreloadingStrategyService } from "./customPreloader.service";

const routes: Routes = [{
  path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:OsmComponent},
  {path:'report',component:OverallComponent},
  {path:'report-pv',component:OverallProvinceComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: SelectivePreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
