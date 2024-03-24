import { Injectable } from '@angular/core';
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }


  openSnackBar(message: string, action: string) {
    if (action === 'error') {
      this.snackbar.open(message, '', {       //passing message to be displayed
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['black-snackbar']     //to apply css. Black BG when error occurs
      });
    }
    else {
      this.snackbar.open(message, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar']     //to apply css. Green BG when no error
      });
    }
  }
}
