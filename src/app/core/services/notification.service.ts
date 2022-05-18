import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';




@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private snackBar: MatSnackBar, private zone: NgZone,) {

  }
  showSnackbarTopPosition(content: any, action: any, type: string, duration?: any) {
    this.zone.run(() => {


      let sb = this.snackBar.open(content, action, {
        duration: duration || 1000,
        verticalPosition: "top", // Allowed values are  'top' | 'bottom'
        horizontalPosition: "end", // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: [type]
      });
      sb.onAction().subscribe(() => {
        sb.dismiss();
      });
    });
  }





  error(msg: string) {
    this.showSnackbarTopPosition(msg, 'done', 'snack-error');

  }


  info(msg: string) {
    this.showSnackbarTopPosition(msg, 'done', 'mat-primary');
  }
  success(msg: string) {
    this.showSnackbarTopPosition(msg, 'done', 'snack-success');
  }
}
