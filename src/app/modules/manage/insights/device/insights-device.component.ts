import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TranslationService } from '../../../shared/services/translation.service';
import { UtilService } from '../../../shared/services/util.service';
import { DeviceLog } from 'src/app/modules/shared/models/device';
import { DeviceService } from 'src/app/modules/shared/services/device.service';
import { InsightsDeviceDetailComponent, LogDeviceDetailDialogModel } from './detail/insights-device-detail.component';

@Component({
  selector: 'app-insights-device',
  templateUrl: './insights-device.component.html',
  styleUrls: ['./insights-device.component.scss']
})
export class InsightsDeviceComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();

  dataSource: DeviceLog[] = [];
  pageSize = 10;
  page = 0;
  totalLogs = 0;

  searchIsHealthy = 'none';
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
    private deviceService: DeviceService,
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
    /* const sampleData: DeviceLog[] = [
      {
        id: '123',
        clientSha256: '',
        clientVersion: '1.2.3',
        hasAntivirus: true,
        hasEncryptedDisc: true,
        hasFirewall: false,
        hostname: 'ferrum notebook',
        insertDate: new Date().toISOString(),
        isHealthy: true,
        macs: '00:11:22:33:44:55',
        osName: "ubuntu",
        osVersion: '22.04',
        platform: 'win32',
        serial: '231a',
        userId: 'someid',
        username: 'someuser',
        whyNotHealthy: 'errTestData'

      },

    ];

    //test data
    this.dataSource = sampleData.map((value, index) => {
      return this.prepareLog(value, index);

    })
 */

    this.search()
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();

  }
  prepareLog(value: DeviceLog, index: number) {
    // these values are also in InsightsActivityDetailComponent class in insights-activity-detail.component.ts
    value.position = (this.page * this.pageSize) + index + 1;
    value.insertDateStr = UtilService.dateFormatToLocale(new Date(value.insertDate))

    return value;
  }

  search() {

    return this.deviceService.get(this.startDate.toISOString(), this.endDate.toISOString(), this.page, this.pageSize, this.searchIsHealthy, this.searchKey,).pipe(
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
  showDetail(element: DeviceLog) {
    const dialogData = new LogDeviceDetailDialogModel(element);

    const dialogRef = this.dialog.open(InsightsDeviceDetailComponent, {

      width: '400',
      height: '600',
      data: dialogData,
      panelClass: 'confirm-background',

    });
    return dialogRef.afterClosed();
  }

}
