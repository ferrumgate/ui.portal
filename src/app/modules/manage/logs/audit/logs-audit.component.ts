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
import { LogAuditDetailDialogModel, LogsAuditDetailComponent } from './detail/logs-audit-detail.component';
import { MatDialog } from '@angular/material/dialog';








@Component({
  selector: 'app-logs-audit',
  templateUrl: './logs-audit.component.html',
  styleUrls: ['./logs-audit.component.scss']
})
export class LogsAuditComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();


  dataSource: AuditLog[] = [];
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
    private auditService: AuditService,
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
    /* const sampleData: AuditLog[] = [
      { insertDate: new Date().toISOString(), ip: '1.2.3.4', message: 'user delete', messageSummary: 'ferrum', severity: 'warn', tags: '12.3', userId: '1234', username: 'abc', messageDetail: 'opsafafa\naadfa' },
      { insertDate: new Date().toISOString(), ip: '1.2.3.5', message: 'user delete', messageSummary: 'ferrum2', severity: 'warn', tags: '12.34', userId: '12344', username: 'abc', messageDetail: 'opsafafa3' },
      { insertDate: new Date().toISOString(), ip: '1.2.3.6', message: 'user delete', messageSummary: 'ferrum3', severity: 'warn', tags: '12.35', userId: '12345', username: 'abc', messageDetail: 'opsafafa4' },
      { insertDate: new Date().toISOString(), ip: '1.2.3.7', message: 'user delete', messageSummary: 'ferrum4', severity: 'warn', tags: '12.36', userId: '12346', username: 'abc', messageDetail: 'opsafafa5' },
      { insertDate: new Date().toISOString(), ip: '1.2.3.8', message: 'user delete', messageSummary: 'ferrum5', severity: 'warn', tags: '12.37', userId: '12347', username: 'abc', messageDetail: 'opsafafa, ada ,aafdasdf a,asdfasdfa,asdfasf, asdfas afasf, asdfasdfsafas asdf,,sdfasf a,,asdfasdfasfa,asdf adfa a,sadf asdf,asdf asdf,,,asdfasf ,,,asdfasdfasdfasdfas,asdfasfdafasf,asdfasfas ' },

    ];

    //test data
    this.dataSource = sampleData.map((value, index) => {
      value.position = (this.page * this.pageSize) + index + 1;
      value.insertDateStr = new Date(value.insertDate).toLocaleDateString() + ' ' + new Date(value.insertDate).toLocaleTimeString()
      value.messageDetailShort = '...';
      value.messageDetailPrepared = value.messageDetail.replace(',', ' ');
      return value;
    })
 */

    this.search()
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }
  prepareLog(value: AuditLog, index: number) {
    value.position = (this.page * this.pageSize) + index + 1;
    value.insertDateStr = UtilService.dateFormatToLocale(new Date(value.insertDate));
    value.messageDetailShort = '...';
    value.messageDetailPrepared = value.messageDetail.replace(',', ' ');
    return value;
  }




  search() {

    return this.auditService.get(this.startDate.toISOString(), this.endDate.toISOString(), this.page, this.pageSize, this.searchKey, undefined, undefined).pipe(
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
  showDetail(element: AuditLog) {
    const dialogData = new LogAuditDetailDialogModel(element.messageDetail.split(','));

    const dialogRef = this.dialog.open(LogsAuditDetailComponent, {

      width: '400',
      height: '600',
      data: dialogData,
      panelClass: 'confirm-background',


    });
    return dialogRef.afterClosed();
  }

}
