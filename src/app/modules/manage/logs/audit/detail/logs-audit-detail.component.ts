import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'src/app/modules/shared/services/config.service';

@Component({
  selector: 'app-logs-audit-detail',
  templateUrl: './logs-audit-detail.component.html',
  styleUrls: ['./logs-audit-detail.component.scss']
})
export class LogsAuditDetailComponent implements OnInit {

  rows: string[];
  isThemeDark = false;
  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<LogsAuditDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogAuditDetailDialogModel) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    // Update view with given values
    this.rows = data.rows;

  }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class LogAuditDetailDialogModel {

  constructor(public rows: string[]) {
  }
}