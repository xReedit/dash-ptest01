import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule } from '@angular/forms';

import { ConfiguracionesRoutingModule } from './configuraciones.routing';

import { MainComponent } from './main/main.component';
import { LametaComponent } from './lameta/lameta.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ConfiguracionesRoutingModule
  ],
  declarations: [
    MainComponent,
    LametaComponent
  ]
})
export class ConfiguracionesModule { }
