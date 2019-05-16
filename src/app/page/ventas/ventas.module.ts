import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { IndicadoresComponent } from './indicadores/indicadores.component';
import { VentasRoutingModule } from './ventas.routing';
import { ClientesComponent } from './clientes/clientes.component';
import { MainComponent } from './main/main.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ComparativaComponent } from './comparativa/comparativa.component';
import { ConsumoComponent } from './consumo/consumo.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    VentasRoutingModule
  ],
  declarations: [
    IndicadoresComponent,
    ClientesComponent,
    MainComponent,
    ColaboradoresComponent,
    ComparativaComponent,
    ConsumoComponent
  ]
})
export class VentasModule { }
