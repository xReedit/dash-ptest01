import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { IndicadoresComponent } from './indicadores/indicadores.component';
import { VentasRoutingModule } from './ventas.routing';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    VentasRoutingModule
  ],
  declarations: [
    IndicadoresComponent
  ]
})
export class VentasModule { }
