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
  selector: 'app-dsetting-2fa',
  templateUrl: './dsetting-2fa.component.html',
  styleUrls: ['./dsetting-2fa.component.scss']
})
export class DSetting2FAComponent implements OnInit, OnDestroy, AfterViewInit {
  private allSubs = new SSubscription();

  isThemeDark = false;


  help = {

  }

  t2fa = {
    is2FA: false,
    t2FAKey: '',
    key: '',
    token: '',
  }


  t2faRefresh = {
    t2FAKey: '',
    key: ''
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
    return this.userService.getCurrentUser2FA()
      .pipe(map(x => {


        this.t2fa = { ...x, token: '' }


      }))
  }


  refreshT2FA(ev: any) {
    this.userService.getCurrentUserRefresh2FA().pipe(map(x => {
      this.t2faRefresh = {
        ...x
      }
    })).subscribe(x => {
      this.notificationService.success(this.translateService.translate('SuccessfullyRefreshed'))
    });
  }

  saveT2FA(ev: any) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.updateCurrentUser2FA(ev)),

    ).subscribe(x => {
      this.t2fa = {
        ...ev,
        token: ''
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'))
    })
  }












}
