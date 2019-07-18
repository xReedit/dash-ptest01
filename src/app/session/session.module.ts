import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionRoutes } from './session.routing';

import { MatButtonModule, MatCardModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SessionRoutes),
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    FormsModule
  ],
  declarations: [
    LoginComponent
  ]
})

export class SessionModule { }
