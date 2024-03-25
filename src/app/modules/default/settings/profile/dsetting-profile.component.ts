import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { map, switchMap, takeWhile } from 'rxjs';
import { UserProfile } from 'src/app/modules/shared/models/userProfile';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UserService } from 'src/app/modules/shared/services/user.service';

@Component({
  selector: 'app-dsetting-profile',
  templateUrl: './dsetting-profile.component.html',
  styleUrls: ['./dsetting-profile.component.scss']
})
export class DSettingProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  private allSubs = new SSubscription();

  isThemeDark = false;

  help = {

  }

  public model: UserProfile;

  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private userService: UserService
  ) {

    this.model = {
      browserTimeout: 15
    }

    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

  }
  ngOnInit(): void {

    this.getData().subscribe();

  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }

  getData() {
    return this.userService.getCurrentUserProfile()
      .pipe(map(x => {
        this.model = { ...x, }
      }))
  }

  saveProfile(ev: any) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.saveCurrentUserProfile(ev)),

    ).subscribe(x => {
      this.model = {
        ...ev,
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    })
  }

}
