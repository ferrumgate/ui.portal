import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from 'src/app/modules/shared/models/group';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { map, of, switchMap, takeWhile } from 'rxjs';


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
    this.help.windows = this.configService.links.installClientWindowsHelp;
    this.help.debian = this.configService.links.installClientDebianHelp
    this.help.linux = this.configService.links.installClientLinuxsHelp;



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
        window.open(this.help.linux, '_blank');
        break;
    }

  }















}
