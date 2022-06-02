import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OsmComponent } from './page/osm/osm.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './page/home/home.component';
import { OverallComponent } from './page/report/overall/overall.component';
import { OverallProvinceComponent } from './page/report/overall-province/overall-province.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OsmComponent,
    HomeComponent,
    OverallComponent,
    OverallProvinceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
