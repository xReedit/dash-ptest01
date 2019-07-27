import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { PuntoEquilibrioComponent } from './punto-equilibrio/punto-equilibrio.component';

const routes: Routes = [{
	path: '', component: MainComponent,
	data: { titulo: 'Principales' },
	children: [
		{
			path: '', redirectTo: 'punto-equilibrio'
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
