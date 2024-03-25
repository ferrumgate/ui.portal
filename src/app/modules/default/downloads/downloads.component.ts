import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UserService } from 'src/app/modules/shared/services/user.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit, OnDestroy, AfterViewInit {
  private allSubs = new SSubscription();

  isThemeDark = false;

  help = {
    windows: '',
    debian: '',
    linux: '',
  }

  releasePage = 'https://github.com/ferrumgate/secure.client/releases';
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private userService: UserService
  ) {

    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.help.windows = this.releasePage;//this.configService.links.installClientWindowsHelp;
    this.help.debian = this.releasePage;//this.configService.links.installClientDebianHelp
    this.help.linux = this.releasePage;//this.configService.links.installClientLinuxsHelp;

  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }

  openReleasePage() {
    window.open(`https://github.com/ferrumgate/secure.client/releases`, '_blank');
  }

  openHelp(type: string) {
    switch (type) {
      case 'linux':
        window.open(this.help.linux, '_blank');
        break;
      case 'debian':
        window.open(this.help.debian, '_blank');
        break;
      case 'windows':
        window.open(this.help.windows, '_blank');
        break;
      default:
        window.open(this.configService.links.installClientLinuxsHelp, '_blank');
        break;
    }

  }

}
