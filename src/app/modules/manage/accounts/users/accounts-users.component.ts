import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, of, switchMap, takeWhile } from 'rxjs';
import { Group } from 'src/app/modules/shared/models/group';
import { RBACDefault, Role } from 'src/app/modules/shared/models/rbac';
import { SSLCertificateEx } from 'src/app/modules/shared/models/sslCertificate';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { PKIService } from 'src/app/modules/shared/services/pki.service';
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
  roles: Role[] = [RBACDefault.roleAdmin, RBACDefault.roleDevOps, RBACDefault.roleReporter, RBACDefault.roleUser];
  loginMethodFormControl = new FormControl('');
  //everyone has password
  loginMethods: { id: string, name: string }[] = [{ id: "password", name: 'Password' }, { id: 'apikey', name: "ApiKey" }, { id: 'certificate', name: 'Certificate' }];
  inCerts: SSLCertificateEx[] = [];


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
    private pkiService: PKIService
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
    of(this.inCerts).pipe(//get only once 
      switchMap(x => {
        if (this.inCerts.length)
          return of({ items: this.inCerts })
        else return this.pkiService.getIntermediateList()
      }),
      map(x => {

        this.inCerts = x.items.filter(y => y.isEnabled && y.category == 'auth')

      }),
      switchMap(a => of(this.groups)),
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
          Array.isArray(this.loginMethodFormControl.value) ? this.loginMethodFormControl.value.map((x: any) => x.id) : [],
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
      const index = this.users.findIndex(x => x.objId == $user.objId)
      if (index >= 0)
        this.users.splice(index, 1);

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
    if ($user.id)
      this.updateUser($user);
    else {
      this.confirmService.showSave().pipe(
        takeWhile(x => x),
        switchMap(y => this.userService.save($user, true, false)),
      ).subscribe((item) => {
        //find saved item and replace it
        const index = this.users.findIndex(x => x.objId == $user.objId)
        $user.isExpanded = true;
        this.users[index] = {
          ...this.users[index],
          ...item.user,
          apiKey: item.sensitiveData.apiKey,
          cert: item.sensitiveData.cert,
          isExpanded: true,
          isLoginMethodsExpanded: true
        }
        this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

      });
    }
  }
  updateUser($user: User2) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.update($user)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.users.findIndex(x => x.objId == $user.objId)
      $user.isExpanded = true;
      this.users[index] = $user;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }


  getUserSensitiveData($user: User2) {
    this.userService.getSensitiveData($user.id, true, true)
      .subscribe((item) => {
        //find item and replace it
        const index = this.users.findIndex(x => x.objId == $user.objId)

        this.users[index] = {
          ...this.users[index],
          apiKey: item.apiKey,
          cert: item.cert,
          isExpanded: true,
          isLoginMethodsExpanded: true
        }


      });
  }
  generateUserApiKey($user: User2) {
    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.updateSensitiveData($user.id, { key: 'apikey' })),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.users.findIndex(x => x.objId == $user.objId)

      this.users[index] = {
        ...this.users[index],
        apiKey: item.apiKey,
        isExpanded: true,
        isLoginMethodsExpanded: true
      }

      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }

  deleteUserApiKey($user: User2) {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y =>
        this.userService.deleteUserSensitiveData($user.id, true, false)
      ),
    ).subscribe((item) => {
      //delete from user list
      const index = this.users.findIndex(x => x.objId == $user.objId);
      this.users[index] = {
        ...this.users[index],
        apiKey: item.apiKey,
        isExpanded: true,
        isLoginMethodsExpanded: true
      }

      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    });
  }

  generateUserCert($user: User2) {

    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(y => this.userService.updateSensitiveData($user.id, undefined, { parentId: $user.cert?.parentId } as any)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.users.findIndex(x => x.objId == $user.objId)

      this.users[index] = {
        ...this.users[index],
        cert: item.cert,
        isExpanded: true,
        isLoginMethodsExpanded: true
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }

  deleteUserCert($user: User2) {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y =>
        this.userService.deleteUserSensitiveData($user.id, false, true)
      ),
    ).subscribe((item) => {
      //delete from user list
      const index = this.users.findIndex(x => x.objId == $user.objId);
      this.users[index] = {
        ...this.users[index],
        cert: item.cert,
        isExpanded: true,
        isLoginMethodsExpanded: true
      }

      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    });
  }

  addNewApiKey() {
    const user: User2 = {
      id: '',
      objId: UtilService.randomNumberString(),
      name: '',
      groupIds: [], roles: [], source: 'local-local', username: '',
      insertDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      roleIds: [], labels: [], isVerified: true,
      isExpanded: true
    }
    this.users.unshift(user);
  }





}
