import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, duration: number = 1500, action: string = 'X') {
    this.snackBar.open(message, action, {
      duration: duration, 
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
