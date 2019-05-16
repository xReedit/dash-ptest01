import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { ClientesComponent } from './clientes/clientes.component';
import { MainComponent } from './main/main.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ComparativaComponent } from './comparativa/comparativa.component';
import { ConsumoComponent } from './consumo/consumo.component';

const routes: Routes = [{
	path: '', component: MainComponent,
	data: { titulo: 'Ventas' },
	children: [
		{
			path: '', redirectTo: 'indicadores'
		},
		{
			path: 'indicadores',
			component: IndicadoresComponent,
			data: { titulo: 'Ventas: Indicadores Globales' }
		},
		{
			path: 'clientes',
			component: ClientesComponent,
			data: { titulo: 'Ventas: Clientes' }
		},
		{
			path: 'colaboradores',
			component: ColaboradoresComponent,
			data: { titulo: 'Ventas: Colaboradores' }
		},
		{
			path: 'comparativa',
			component: ComparativaComponent,
			data: { titulo: 'Ventas: Comparativa' }
		},
		{
			path: 'consumo',
			component: ConsumoComponent,
			data: { titulo: 'Ventas: Consumo' }
		}
	]
}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class VentasRoutingModule { }
