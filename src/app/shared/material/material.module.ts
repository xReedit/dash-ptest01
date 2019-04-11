import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule
  ],

  exports: [
    MatCardModule,
    MatIconModule,
    MatInputModule
  ],

  declarations: []
})

export class MaterialModule { }
