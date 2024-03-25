import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DeviceLog } from 'src/app/modules/shared/models/device';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { TranslationService } from '../../../../shared/services/translation.service';

@Component({
  selector: 'app-insights-device-table',
  templateUrl: './insights-device-table.component.html',
  styleUrls: ['./insights-device-table.component.scss']
})
export class InsightsDeviceTableComponent implements OnInit, OnDestroy {

  private allSubs = new SSubscription();
  searchForm = new FormControl();
  helpLink = '';
  displayedColumns: string[] = ['position', 'insertDate', 'platform',
    'osName', 'osVersion', 'hostname', 'clientVersion', 'username', 'networkName', 'isHealthy', 'whyNotHealthy',
    'detail'];

  pageSize = 10;
  page = 0;
  totalLogs = 0;
  @Input()
  dataSource: DeviceLog[] = [];

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

    this.helpLink = this.configService.links.insightDeviceHelp;
  }
  ngOnInit(): void {

  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();

  }

  showDetail(element: DeviceLog) {
    this.onShowDetail.emit(element);
  }
  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }

}
