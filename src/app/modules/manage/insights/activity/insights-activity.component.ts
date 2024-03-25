import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { ActivityLog } from 'src/app/modules/shared/models/activityLog';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ActivityService } from 'src/app/modules/shared/services/activity.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslationService } from '../../../shared/services/translation.service';
import { UtilService } from '../../../shared/services/util.service';
import { InsightsActivityDetailComponent, LogActivityDetailDialogModel } from './detail/insights-activity-detail.component';

@Component({
  selector: 'app-insights-activity',
  templateUrl: './insights-activity.component.html',
  styleUrls: ['./insights-activity.component.scss']
})
export class InsightsActivityComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();

  dataSource: ActivityLog[] = [];
  pageSize = 10;
  page = 0;
  totalLogs = 0;

  startDate: Date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  endDate: Date = new Date();
  startDateControl = new FormControl();
  endDateControl = new FormControl();
  isThemeDark = false;
  searchKey = '';
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private activityService: ActivityService,
    private dialog: MatDialog

  ) {

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';
    //search input with wait
    this.allSubs.addThis =
      this.searchForm.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
      ).subscribe(newMessage => {
        this.searchKey = newMessage;

      })

    this.allSubs.addThis =
      this.startDateControl.valueChanges
        .pipe(debounceTime(100))
        .subscribe(x => {
          if (this.startDateControl.valid) {
            this.startDate = x ? new Date(x) : new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

          }
        })
    this.allSubs.addThis =
      this.endDateControl.valueChanges
        .pipe(debounceTime(100))
        .subscribe(x => {
          if (this.endDateControl.valid) {
            this.endDate = x ? new Date(x) : new Date()

          }
        })

  }
  ngOnInit(): void {
    /*  const sampleData: ActivityLog[] = [
       {
         "requestId": "i8oB3eCcFrMrEpK32DAKzOSDz5ck4eq4R69UGYkN3T3kpoDbkewNXHhC37z659Vx",
         "type": "access token",
         "username": "hamza@hamzakilic.com",
         "userId": "97CwQ6gRHPaRHBWH",
         "user2FA": false,
         "authSource": "local",
         "insertDate": "2023-02-12T13:46:34.661Z",
         "ip": "192.168.88.10",
         "status": 200,
         "sessionId": "t87H20P0K2gfqnONAwI1Bxfzm1sLcEfgF3OoqDxtfxtZuez246FAdQggeCgA9zxC",
         "requestPath": "/api/auth/accesstoken",
         "assignedIp": 'null',
         "tunnelId": 'null',
         "tun": 'null',
         "tunType": 'null',
         "trackId": 0,
         "gatewayId": 'null'
       },
 
     ];
 
     //test data
     this.dataSource = sampleData.map((value, index) => {
       return this.prepareLog(value, index);
 
     }) */

    this.search()
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();

  }
  prepareLog(value: ActivityLog, index: number) {
    // these values are also in InsightsActivityDetailComponent class in insights-activity-detail.component.ts
    value.position = (this.page * this.pageSize) + index + 1;
    value.insertDateStr = UtilService.dateFormatToLocale(new Date(value.insertDate))
    value.sessionIdSub = value.sessionId ? (value.sessionId.substring(0, 6) + '...') : undefined;
    value.requestIdSub = value.requestId ? (value.requestId.substring(0, 6) + '...') : undefined;
    value.tunnelIdSub = value.tunnelId ? (value.tunnelId.substring(0, 6) + '...') : undefined;

    return value;
  }

  search() {

    return this.activityService.get(this.startDate.toISOString(), this.endDate.toISOString(), this.page, this.pageSize, this.searchKey,).pipe(
      map(y => {
        this.totalLogs = y.total;

        this.dataSource = y.items.map((x, index) => {
          return this.prepareLog(x, index);
        })
      })
    ).subscribe();
  }

  pageChanged($event: any) {
    this.pageSize = $event.pageSize;
    this.page = $event.pageIndex;
    this.search();

  }
  showDetail(element: ActivityLog) {
    const dialogData = new LogActivityDetailDialogModel(element);

    const dialogRef = this.dialog.open(InsightsActivityDetailComponent, {

      width: '400',
      height: '600',
      data: dialogData,
      panelClass: 'confirm-background',

    });
    return dialogRef.afterClosed();
  }

}
