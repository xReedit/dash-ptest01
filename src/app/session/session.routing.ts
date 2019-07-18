import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const SessionRoutes: Routes = [
    {
      path: '',
      children: [{
            path: 'login',
            component: LoginComponent
        }
    //   , {
    //     path: 'error',
    //     component: ErrorComponent
    //   }
        ]
    }
  ];
