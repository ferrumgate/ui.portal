import { ApplicationRef, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../../shared/services/input.service';

import { UtilService } from '../../../shared/services/util.service';
import { concat, concatMap, debounceTime, distinctUntilChanged, filter, map, merge, mergeMap, of, startWith, Subject, Subscription, switchMap, takeUntil, takeWhile } from 'rxjs';
import { TranslationService } from '../../../shared/services/translation.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { ThemeSelectorComponent } from '../../../shared/themeselector/themeselector.component';
import { Group } from 'src/app/modules/shared/models/group';
import { User, User2 } from 'src/app/modules/shared/models/user';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { GroupService } from 'src/app/modules/shared/services/group.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
@Component({
  selector: 'app-accounts-groups',
  templateUrl: './accounts-groups.component.html',
  styleUrls: ['./accounts-groups.component.scss']
})
export class AccountsGroupsComponent implements OnInit, OnDestroy {
  private allSubs = new SSubscription();
  searchForm = new FormControl();


  groups: Group[] = [];
  users: User[] = [];
  isThemeDark = false;

  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private groupService: GroupService,
    private userService: UserService
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
    /*  this.users.push({
       id: 'adf', name: 'david', username: 'davidof', groupIds: ['test1', 'test2'], roles: []
     })
     this.users.push({
       id: 'adf2', name: 'memo', username: 'memo@gmail.com', groupIds: ['test2'], roles: []
     })
     this.users.push({
       id: 'adf3', name: 'memo1', username: 'memo1@gmail.com', groupIds: ['test2'], roles: []
     })
     this.users.push({
       id: 'adf4', name: 'memo2', username: 'memo2@gmail.com', groupIds: ['test2'], roles: []
     })
     this.users.push({
       id: 'adf5', name: 'memo3', username: 'memo3@gmail.com', groupIds: ['test2'], roles: []
     })
     this.users.push({
       id: 'adf6', name: 'memo4', username: 'memo4@gmail.com', groupIds: ['test2'], roles: []
     })
     this.users.push({
       id: 'adf7', name: 'memo5', username: 'memo5@gmail.com', groupIds: ['test2'], roles: []
     })
     //
     const group1 = {
       id: 'test1', name: 'north', labels: ['accountman', 'delete'], isEnabled: true
 
     }
     this.groups.push(this.prepareGroup(group1, this.users));
 
     const group2 = {
       id: 'test2', name: 'south', labels: [],
       isEnabled: true
     }
     this.groups.push(this.prepareGroup(group2, this.users));
  */
    this.getAllData().subscribe();
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }
  prepareGroup(group: Group, userList: User[]) {
    const users = userList.filter(x => x.groupIds.includes(group.id));
    let item = {
      ...group,
      labels: Array.from(group.labels),
      users: users.map(x => {
        return { id: x.id, username: x.username, groupIds: x.groupIds }
      }),
      searchedUsers: users.map(x => {
        return { id: x.id, username: x.username, groupIds: x.groupIds }
      }),
      usersCount: users.length,
      isUsersOpened: false,
      userSearch: new FormControl
    }
    this.allSubs.addThis =
      item.userSearch.valueChanges.pipe(debounceTime(1000),
        distinctUntilChanged(),
      ).subscribe(newMessage => {
        item.searchedUsers = Array.from(item.users);
        if (newMessage)
          item.searchedUsers = item.users.filter(x => x.username.toLowerCase().includes(newMessage));
      });
    return item;

  }
  getAllData() {
    return this.userService.get2(0, 0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'simple').pipe(
      map(y => {
        this.users = y.items as any;
      }),
      switchMap(y => this.groupService.get2()),
      map(z => {
        this.groups = z.items.map(x => this.prepareGroup(x, this.users));
      })
    )

  }


  search(data: string) {
    if (!data?.length || data?.length > 2) {
      if (data == '')
        this.getAllData().subscribe();
      else {
        this.groupService.get2(data).pipe(
          map(y => {
            this.groups = y.items.map(x => {
              return this.prepareGroup(x, this.users);
            });
            return y;
          })
        ).subscribe();
      }
    }
  }
  addNewGroup() {
    const group: Group = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', labels: [], isEnabled: true
    }
    this.groups.unshift(this.prepareGroup(group, this.users));
  }
  saveGroup($event: Group) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.groupService.saveOrupdate($event)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.groups.findIndex(x => x.objId == $event.objId)
      this.groups[index] = this.prepareGroup(item, this.users);
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }
  deleteGroup($event: Group) {
    if (!$event.id) {//network we created temporarily
      const index = this.groups.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.groups.splice(index, 1);

    } else {
      //real group execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.groupService.delete($event)
        ),
      ).subscribe((x) => {
        //delete from group list
        const index = this.groups.findIndex(x => x.objId == $event.objId);
        this.groups.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }


  deleteUserFromGroup(user: User2, group: Group) {

    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(a => this.userService.get(user.id)),
      switchMap(y => {
        let index = user.groupIds.findIndex(x => x == group.id);
        if (index >= 0)
          user.groupIds.splice(index, 1);
        return this.userService.saveOrupdate(user);
      }
      ),
    ).subscribe((x) => {

      //delete from group list
      const groupLocal = this.groups.find(x => x.id == group.id);

      if (groupLocal) {
        const userFounded = this.users.find(x => x.id == user.id)
        if (userFounded)
          userFounded.groupIds = user.groupIds;

        const prepared = this.prepareGroup(groupLocal, this.users);
        if (!prepared.usersCount)
          prepared.isUsersOpened = false;
        else
          prepared.isUsersOpened = true;

        let index3 = this.groups.findIndex(x => x.id == group.id);

        this.groups[index3] = {
          ...prepared
        }
      }



      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
    });
  }



}
