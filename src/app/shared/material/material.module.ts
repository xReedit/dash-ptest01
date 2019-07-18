import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
  ],

  exports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
  ],

  declarations: []
})

export class MaterialModule { }
