import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, of, switchMap, takeWhile } from 'rxjs';
import { Group } from 'src/app/modules/shared/models/group';
import { RBACDefault, Role } from 'src/app/modules/shared/models/rbac';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { ThemeSelectorComponent } from 'src/app/modules/shared/themeselector/themeselector.component';

@Component({
  selector: 'app-accounts-users',
  templateUrl: './accounts-users.component.html',
  styleUrls: ['./accounts-users.component.scss']
})
export class AccountsUsersComponent implements OnInit, OnDestroy {

  private allSubs = new SSubscription();
  searchForm = new FormControl();
  searchIsVerified = 'none';
  searchIsLocked = 'none';
  searchIsEmailVerified = 'none';
  searchIs2FA = 'none';
  searchKey = '';

  groupFormControl = new FormControl('');
  groups: Group[] = [];

  roleFormControl = new FormControl('');
  roles: Role[] = [RBACDefault.roleAdmin, RBACDefault.roleReporter, RBACDefault.roleUser];


  users: User2[] = [];
  isThemeDark = false;
  pageSize = 10;
  page = 0;
  totalUsers = 0;
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private userService: UserService,
    private groupService: GroupService,
  ) {

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })

    this.isThemeDark = this.configService.getTheme() == 'dark';
    //search input with wait
    this.allSubs.addThis =
      this.searchForm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe(newMessage => {
        this.searchKey = newMessage;
        this.search();
      })



  }

  ngOnInit(): void {
    //test data
    /*  this.groups.push({ id: 'group1', name: 'North1', isEnabled: true, labels: [] })
     this.groups.push({ id: 'group2', name: 'North2', isEnabled: true, labels: [] })
     this.groups.push({ id: 'group3', name: 'North3', isEnabled: true, labels: [] })
 
     const user1: User2 = {
       username: 'hamza@ferrumgate.com',
       id: 'someid',
       name: 'hamza',
       source: 'local',
       roleIds: ['Admin'],
       isLocked: false, isVerified: true,
       insertDate: new Date().toISOString(),
       updateDate: new Date().toISOString(),
       groupIds: ['group1']
 
     }
     this.users.push(
       user1
     )
 
     const user2: User2 = {
       username: 'hamza2@ferrumgate.com',
       id: 'someid2',
       name: 'hamza2',
       source: 'google',
       roleIds: ['Admin'],
       isLocked: false, isVerified: true,
       insertDate: new Date().toISOString(),
       updateDate: new Date().toISOString(),
       groupIds: ['group2']
 
     }
     this.users.push(
       user2
     )
 
     const user3 = {
       ...user2
     }
     user3.id = 'someid3';
     user3.username = 'hamza3@ferrumgate.com';
     this.users.push(user3);
 
     const user4 = {
       ...user2
     }
     user4.id = 'someid4';
     user4.username = 'hamza4@ferrumgate.com';
     this.users.push(user4);
  */
    this.search();
  }
  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }

  search() {

    of(this.groups).pipe(
      switchMap((x) => {//get groups only once
        if (!x.length)
          return this.groupService.get2().pipe(map(x => x.items));
        return of(x);
      }),
      map(x => this.groups = x),
      switchMap(x =>
        this.userService.get2(
          this.page, this.pageSize, this.searchKey, undefined,
          Array.isArray(this.groupFormControl.value) ? this.groupFormControl.value.map((x: any) => x.id) : [],
          Array.isArray(this.roleFormControl.value) ? this.roleFormControl.value.map((x: any) => x.id) : [],
          this.searchIs2FA,
          this.searchIsVerified,
          this.searchIsLocked,
          this.searchIsEmailVerified,
          undefined
        )), map(y => {
          this.totalUsers = y.total;
          this.users = y.items.map(x => {
            x.objId = UtilService.randomNumberString()
            return x;
          })


        })).subscribe();
  }

  pageChanged($event: any) {
    this.pageSize = $event.pageSize;
    this.page = $event.pageIndex;
    this.search();
  }

  deleteUser($user: User2) {
    if (!$user.id) {//user we created temporarily
      const index = this.groups.findIndex(x => x.objId == $user.objId)
      if (index >= 0)
        this.groups.splice(index, 1);

    } else {
      //real group execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.userService.delete($user)
        ),
      ).subscribe((x) => {
        //delete from user list
        const index = this.users.findIndex(x => x.objId == $user.objId);
        this.users.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }

  }
  saveUser($user: User2) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.saveOrupdate($user)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.users.findIndex(x => x.objId == $user.objId)
      $user.isExpanded = true;
      this.users[index] = $user;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }


}
