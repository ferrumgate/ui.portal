import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Group } from 'src/app/modules/shared/models/group';
import { RBACDefault, Role } from 'src/app/modules/shared/models/rbac';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

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

  groupFormControl = new FormControl('');
  groups: Group[] = [];

  roleFormControl = new FormControl('');
  roles: Role[] = [RBACDefault.roleAdmin, RBACDefault.roleReporter, RBACDefault.roleUser];


  users: User2[] = [];
  isThemeDark = false;

  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
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

        this.search(newMessage);
      })



  }

  ngOnInit(): void {
    //test data
    this.groups.push({ id: 'group1', name: 'North1', isEnabled: true, labels: [] })
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

  }
  ngOnDestroy(): void {
    this.allSubs.unsubscribe();
  }
  search(newMessage: any) {

  }

}
