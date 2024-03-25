import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, of, switchMap, takeWhile } from 'rxjs';
import { IpIntelligenceList, IpIntelligenceListStatus } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-config-ip-intelligence-list',
  templateUrl: './config-ip-intelligence-list.component.html',
  styleUrls: ['./config-ip-intelligence-list.component.scss']
})
export class ConfigIpIntelligenceListComponent implements OnInit, OnDestroy {
  allSubs = new SSubscription();
  searchForm = new FormControl();
  networkFormControl = new FormControl();

  lists: IpIntelligenceList[] = [];
  @Input()
  helpLink = ''
  isThemeDark = false;
  searchKey = '';
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private ipIntelligenceService: IpIntelligenceService) {

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

    // real data
    this.getAllData().subscribe();
  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  getAllData() {
    //test data

    /* let testData: { items: IpIntelligenceList[], itemsStatus: IpIntelligenceListStatus[] } = {
      items:
        [
          {
            id: '1', insertDate: new Date().toString(), name: 'htt list', updateDate: new Date().toString(), labels: ['test'],
            http: {
              url: 'https://ferrumgate.com', checkFrequency: 60
            }
          },

          {
            id: '2', insertDate: new Date().toString(), name: 'file list', updateDate: new Date().toString(), labels: ['test'],
            file: {
              source: 'upload.txt'
            }
          }
        ],
      itemsStatus: [
        {
          id: '1', isChanged: true, lastCheck: new Date().toISOString(), lastError: '',
        }
      ]
    } */
    let testData = { items: [], itemsStatus: [] };

    return (testData.items.length ? of(testData) : this.ipIntelligenceService.getList('')).pipe(
      map(z => {
        this.lists = z.items.map(x => {

          return this.prepareList(x, z.itemsStatus.find(y => y.id == x.id))
        }).sort((a, b) => {

          return a.name.localeCompare(b.name)
        })
      })
    )

  }
  prepareList(list: IpIntelligenceList, status?: IpIntelligenceListStatus) {

    list.objId = UtilService.randomNumberString();
    list.insertDateStr = UtilService.dateFormatToLocale(new Date(list.insertDate));
    list.status = status;
    list.status = { ...list.status, hasFile: status ? true : false }
    if (list.status) {
      if (list.status.lastCheck)
        list.status.lastCheck = UtilService.dateFormatToLocale(new Date(list.status.lastCheck))
      list.status.lastMessage = list.status.isChanged ? 'Updated' : 'NothingChanged';
    }

    return list;
  }

  search() {

    let search = this.searchKey;
    if (search == '')
      this.getAllData().subscribe();
    else {
      this.ipIntelligenceService.getList(search).pipe(
        map(z => {
          this.lists = z.items.map(x => {

            return this.prepareList(x, z.itemsStatus.find(y => y.id == x.id))
          }).sort((a, b) => {

            return a.name.localeCompare(b.name)
          })
        })
      ).subscribe();
    }

  }
  addNewList(type: 'http' | 'file') {
    const list: IpIntelligenceList = {
      objId: UtilService.randomNumberString(),
      id: '', name: '', labels: [],
      insertDate: new Date().toISOString(), updateDate: '',
      isExpanded: true,
    }
    if (type == 'file')
      list.file = { source: '' };
    else list.http = { checkFrequency: 60, url: 'https://www.ferrumgate.com' }
    this.lists.unshift(list);
  }
  saveList($event: IpIntelligenceList) {
    if ($event.fileKey) {
      if ($event.file)
        $event.file.key = $event.fileKey;
      this.saveList2($event).subscribe();
    } else {
      this.confirmService.showSave().pipe(
        takeWhile(x => x),
        switchMap(y => this.saveList2($event)),
      ).subscribe();

    }

  }
  saveList2($event: IpIntelligenceList) {
    return this.ipIntelligenceService.saveOrupdateList($event).pipe(
      map(
        (item) => {
          //find saved item and replace it
          const index = this.lists.findIndex(x => x.objId == $event.objId);
          const oldObj = this.lists[index];
          this.lists[index] = {
            ...item,
            objId: oldObj.objId
          }
          this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

        }));

  }

  deleteList($event: IpIntelligenceList) {
    if (!$event.id) {//list we created temporarily
      const index = this.lists.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.lists.splice(index, 1);

    } else {
      //real  execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.ipIntelligenceService.deleteList($event)
        ),
      ).subscribe((x) => {
        //delete from group list
        const index = this.lists.findIndex(x => x.objId == $event.objId);
        this.lists.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }

  downloadList($event: IpIntelligenceList) {
    if (!$event.id) return; // a problem

    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(x => {
        this.notificationService.success(this.translateService.translate('WaitWhileDownloading'));
        return of(x);
      }),
      switchMap(x => this.ipIntelligenceService.downloadList($event))).subscribe(x => {
        this.notificationService.success(this.translateService.translate('DownloadFinished'))
      });

  }

  resetList($event: IpIntelligenceList) {
    if (!$event.id) return; // a problem

    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(x => this.ipIntelligenceService.resetList($event))).subscribe(x => {
        this.notificationService.success(this.translateService.translate('SuccessfullyReseted'))
      });

  }

}
