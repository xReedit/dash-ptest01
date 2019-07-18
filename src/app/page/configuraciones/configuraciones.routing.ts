import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LametaComponent } from './lameta/lameta.component';

const routes: Routes = [{
	path: '', component: MainComponent,
	data: { titulo: 'Metas' },
	children: [
		{
			path: '', redirectTo: 'meta'
		},
		{
			path: 'meta',
			component: LametaComponent,
			data: { titulo: 'Establecer Metas' }
		}
	]
}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConfiguracionesRoutingModule { }
