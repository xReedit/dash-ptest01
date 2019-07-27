import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { PrincipalesRoutingModule } from './principales.routing';
import { MainComponent } from './main/main.component';
import { PuntoEquilibrioComponent } from './punto-equilibrio/punto-equilibrio.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    PrincipalesRoutingModule
  ],
  declarations: [
    MainComponent,
    PuntoEquilibrioComponent
  ]
})
export class PrincipalesModule { }
