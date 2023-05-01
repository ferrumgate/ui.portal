import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceLog } from 'src/app/modules/shared/models/device';
import { ConfigService } from 'src/app/modules/shared/services/config.service';

@Component({
  selector: 'app-insights-device-detail',
  templateUrl: './insights-device-detail.component.html',
  styleUrls: ['./insights-device-detail.component.scss']
})
export class InsightsDeviceDetailComponent implements OnInit {

  displayedColumns: string[] = ['key', 'value'];
  excludeProperties: string[] = ['position', 'insertDateStr']
  pageSize = 10;
  page = 0;
  totalLogs = 0;
  dataSource: { key: string, value: any }[] = [];
  isThemeDark = false;
  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<InsightsDeviceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogDeviceDetailDialogModel) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    // Update view with given values
    this.dataSource = [];
    if (data.device)
      Object.keys(data.device).forEach(y => {
        if (!this.excludeProperties.includes(y)) {
          this.dataSource.push({ key: y, value: data.device[y] })
        }
      })

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
export class LogDeviceDetailDialogModel {

  constructor(public device: DeviceLog) {
  }
}