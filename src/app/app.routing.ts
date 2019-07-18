import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './core/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guard/auth.guard';

export const AppRoutes: Routes = [
    {
      path: '',
      canActivate: [AuthGuard],
      component: AdminLayoutComponent,
      children: [
        // {
        //   path: 'dashboard',
        //   loadChildren: './dashboard/dashboard.module#DashboardModule',
        //   canActivate: [AuthGuard],
        //   data : {'tituloModulo' : 'Inicio'}
        // },
        {
          // path: 'ventas',
          path: 'dashboard', // por los momentos
          loadChildren: './page/ventas/ventas.module#VentasModule',
          data: { 'tituloModulo': 'Ventas:'  }
        },
        {
          path: 'configuraciones', // por los momentos
          loadChildren: './page/configuraciones/configuraciones.module#ConfiguracionesModule',
          data: { 'tituloModulo': 'Configuraciones:' }
        }
      ]
    },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: 'session',
      loadChildren: './session/session.module#SessionModule'
    }]
  }
];
