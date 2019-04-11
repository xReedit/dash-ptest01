import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicadoresComponent } from './indicadores/indicadores.component';

const routes: Routes = [{
	path: '', component: IndicadoresComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class VentasRoutingModule { }
