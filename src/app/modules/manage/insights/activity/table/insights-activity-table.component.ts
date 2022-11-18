import { ApplicationRef, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from 'src/app/modules/shared/models/group';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { TranslationService } from '../../../../shared/services/translation.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { debounceTime, of, distinctUntilChanged, map, switchMap, takeWhile, sample } from 'rxjs';
import { UtilService } from '../../../../shared/services/util.service';
import { Service } from '../../../../shared/models/service';
import { Network } from '../../../../shared/models/network';
import { NetworkService } from '../../../../shared/services/network.service';
import { ServiceService } from '../../../../shared/services/service.service';
import { AuditLog } from 'src/app/modules/shared/models/auditLog';
import { ActivityLog } from 'src/app/modules/shared/models/activityLog';








@Component({
  selector: 'app-insights-activity-table',
  templateUrl: './insights-activity-table.component.html',
  styleUrls: ['./insights-activity-table.component.scss']
})
export class InsightsActivityTableComponent implements OnInit, OnDestroy {

  private allSubs = new SSubscription();
  searchForm = new FormControl();
  helpLink = '';
  displayedColumns: string[] = ['position', 'insertDate', 'type',
    'source', 'requestId', 'ip', 'username', 'sessionId', 'serviceName',
    'gatewayName', 'networkName', 'status', 'statusMessage',
    'authnRule', 'authzRule',
    'detail'];

  pageSize = 10;
  page = 0;
  totalLogs = 0;
  @Input()
  dataSource: ActivityLog[] = [];


  @Output() onShowDetail = new EventEmitter();
  isThemeDark = false;

  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private userService: UserService,

  ) {

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.insightActivityHelp;
  }
  ngOnInit(): void {


  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }



  showDetail(element: AuditLog) {
    this.onShowDetail.emit(element);
  }
  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }

}
