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
        {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard],
        data : {'tituloModulo' : 'Inicio'}
        },
        {
          path: 'ventas/indicadores',
          loadChildren: './page/ventas/ventas.module#VentasModule'
        },
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
