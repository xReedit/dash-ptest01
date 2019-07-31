import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { InicioComponent } from './inicio/inicio.component';
import { PuntoEquilibrioComponent } from './punto-equilibrio/punto-equilibrio.component';


const routes: Routes = [{
	path: '', component: MainComponent,
	data: { titulo: 'Principales' },
	children: [
		{
			path: '', redirectTo: 'inicio'
		},
		{
			path: 'inicio',
			component: InicioComponent,
			data: { titulo: 'Inicio' }
		},
		{
			path: 'punto-equilibrio',
			component: PuntoEquilibrioComponent,
			data: { titulo: 'Principales: Punto de equilibrio' }
		}
	]
}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PrincipalesRoutingModule { }
