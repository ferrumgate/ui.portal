import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeWhile } from 'rxjs';
import { AuthLocal, AuthSettings, BaseLdap, BaseOAuth, BaseSaml } from 'src/app/modules/shared/models/auth';
import { DevicePosture, OSType } from 'src/app/modules/shared/models/device';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { DeviceService } from 'src/app/modules/shared/services/device.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';




@Component({
  selector: 'app-config-deviceposture',
  templateUrl: './config-deviceposture.component.html',
  styleUrls: ['./config-deviceposture.component.scss']
})
export class ConfigDevicePostureComponent implements OnInit {
  private allSubs = new SSubscription();
  searchForm = new FormControl();
  isThemeDark = false;
  searchKey = '';
  postures: DevicePosture[] = [];
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private deviceService: DeviceService

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

    /*  let posturewin32: DevicePosture = {
       id: 's1',
       name: 'deneme', labels: ['test1'],
       insertDate: new Date().toISOString(),
       updateDate: new Date().toISOString(),
       isEnabled: true, os: 'win32',
       isExpanded: true
     }
     this.postures.push(posturewin32); */
    this.getAllData().subscribe();
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();


  }


  getAllData() {

    return this.deviceService.getDevicePosture2().pipe(
      map(z => {
        this.postures = z.items.sort((a, b) => a.name.localeCompare(b.name)).map(x => {
          x.objId = UtilService.randomNumberString();
          return x;
        })
      })
    )

  }


  search() {
    let search = this.searchKey.length > 1 ? this.searchKey : '';

    this.deviceService.getDevicePosture2(search, []).pipe(

      map(z => {
        this.postures = z.items.sort((a, b) => a.name.localeCompare(b.name)).map(x => {
          x.objId = UtilService.randomNumberString();
          return x;
        })
      })
    ).subscribe();

  }
  addNewDevicePosture(platform: OSType) {
    const posture: DevicePosture = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', labels: [], isEnabled: true,
      os: platform, insertDate: new Date().toISOString(), updateDate: new Date().toISOString(),
      isExpanded: true

    }
    this.postures.unshift(posture);
  }
  saveDevicePosture($event: DevicePosture) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.deviceService.saveOrupdateDevicePosture($event)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.postures.findIndex(x => x.objId == $event.objId);
      const oldObj = this.postures[index];
      this.postures[index] = {
        ...item,
        objId: oldObj.objId,
        isExpanded: true
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }
  deleteDevicePosture($event: DevicePosture) {
    if (!$event.id) {//posture we created temporarily
      const index = this.postures.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.postures.splice(index, 1);

    } else {
      //real item execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.deviceService.deleteDevicePosture($event)
        ),
      ).subscribe((x) => {
        //delete from  list
        const index = this.postures.findIndex(x => x.objId == $event.objId);
        this.postures.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }
}