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
  selector: 'app-dsetting-password',
  templateUrl: './dsetting-password.component.html',
  styleUrls: ['./dsetting-password.component.scss']
})
export class DSettingPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  private allSubs = new SSubscription();

  isThemeDark = false;


  help = {

  }

  changePassModel = { oldPass: '', newPass: '', newPassAgain: '', isChanged: false };







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


  }
  ngOnInit(): void {


  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }


  changePass(ev: any) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.updateCurrentUserPass(ev)),

    ).subscribe(x => {
      this.changePassModel = {
        isChanged: false, newPass: '', newPassAgain: '', oldPass: ''
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    })
  }












}
