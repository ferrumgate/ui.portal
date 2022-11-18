import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityLog } from 'src/app/modules/shared/models/activityLog';
import { ConfigService } from 'src/app/modules/shared/services/config.service';

@Component({
  selector: 'app-insights-activity-detail',
  templateUrl: './insights-activity-detail.component.html',
  styleUrls: ['./insights-activity-detail.component.scss']
})
export class InsightsActivityDetailComponent implements OnInit {

  displayedColumns: string[] = ['key', 'value'];
  excludeProperties: string[] = ['position', 'sessionIdSub', 'requestIdSub', 'insertDateStr', 'requestIdSub', 'tunnelIdSub']
  pageSize = 10;
  page = 0;
  totalLogs = 0;
  dataSource: { key: string, value: any }[] = [];
  isThemeDark = false;
  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<InsightsActivityDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogActivityDetailDialogModel) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    // Update view with given values
    this.dataSource = [];
    if (data.activity)
      Object.keys(data.activity).forEach(y => {
        if (!this.excludeProperties.includes(y))
          this.dataSource.push({ key: y, value: data.activity[y] })
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
export class LogActivityDetailDialogModel {

  constructor(public activity: ActivityLog) {
  }
}