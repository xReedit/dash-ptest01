import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, _duration = 3500) {
    return this._snackBar.open(message, action, { duration: _duration });
  }
}
