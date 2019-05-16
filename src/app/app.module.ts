import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CrudHttpService } from './shared/crud-http.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';


import { AppRoutes } from './app.routing';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './core/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './core/auth-layout/auth-layout.component';
import { HeaderTollbarComponent } from './core/header-tollbar/header-tollbar.component';
import { SiderbarComponent } from './core/siderbar/siderbar.component';
import { BreadcrumbComponent } from './core/breadcrumb/breadcrumb.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    HeaderTollbarComponent,
    SiderbarComponent,
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,

    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule

  ],
  providers: [CrudHttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
