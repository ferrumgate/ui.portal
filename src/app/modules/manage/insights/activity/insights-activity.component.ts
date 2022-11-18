import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from 'src/app/modules/shared/models/group';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { TranslationService } from '../../../shared/services/translation.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { debounceTime, of, distinctUntilChanged, map, switchMap, takeWhile, sample } from 'rxjs';
import { UtilService } from '../../../shared/services/util.service';
import { Service } from '../../../shared/models/service';
import { Network } from '../../../shared/models/network';
import { NetworkService } from '../../../shared/services/network.service';
import { ServiceService } from '../../../shared/services/service.service';
import { AuditLog } from 'src/app/modules/shared/models/auditLog';
import { AuditService } from 'src/app/modules/shared/services/audit.service';
import { MatDialog } from '@angular/material/dialog';
import { InsightsActivityDetailComponent, LogActivityDetailDialogModel } from './detail/insights-activity-detail.component';
import { ActivityLog } from 'src/app/modules/shared/models/activityLog';
import { ActivityService } from 'src/app/modules/shared/services/activity.service';








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
            this.startDate = new Date(x);

          }
        })
    this.allSubs.addThis =
      this.endDateControl.valueChanges
        .pipe(debounceTime(100))
        .subscribe(x => {
          if (this.endDateControl.valid) {
            this.endDate = new Date(x);

          }
        })

  }
  ngOnInit(): void {
    /*  const sampleData: ActivityLog[] = [
       {
         insertDate: new Date().toISOString(),
         ip: '1.2.3.4',
         requestId: 'e1nxwp9mk4z92bz4gc9uvvay564onekix9aljtwiw30dlu9hk99tzav6zetpevkn',
         authSource: 'local',
         status: 0,
         type: 'login try',
         statusMessage: 'success',
         sessionId: '8ivi30xnefo9j5blsjymvjdsyqlmhl9izhi040tj525rshrtalv8qm1qpskv8y1x',
         username: 'o5x6izkewj20'
 
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
    value.insertDateStr = new Date(value.insertDate).toLocaleDateString() + ' ' + new Date(value.insertDate).toLocaleTimeString()
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
