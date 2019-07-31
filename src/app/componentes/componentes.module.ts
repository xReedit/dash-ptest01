import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { CompListSedeComponent } from './comp-list-sede/comp-list-sede.component';
import { CompListYyComponent } from './comp-list-yy/comp-list-yy.component';
import { CompSelectMesDiaComponent } from './comp-select-mes-dia/comp-select-mes-dia.component';



@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatTabsModule
  ],
  declarations: [
    CompListSedeComponent,
    CompListYyComponent,
    CompSelectMesDiaComponent
  ],
  exports: [
    CompListSedeComponent,
    CompListYyComponent,
    CompSelectMesDiaComponent
  ]
})
export class ComponentesModule { }
