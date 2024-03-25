import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeWhile } from 'rxjs';
import { DnsRecord } from 'src/app/modules/shared/models/dns';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { DnsService } from 'src/app/modules/shared/services/dns.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-config-dns',
  templateUrl: './config-dns.component.html',
  styleUrls: ['./config-dns.component.scss']
})
export class ConfigDnsComponent implements OnInit {
  private allSubs = new SSubscription();
  searchForm = new FormControl();
  isThemeDark = false;
  searchKey = '';
  records: DnsRecord[] = [];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private dnsService: DnsService

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

    /*  let posturewin32: Dns = {
       id: 's1',
       fqdn: 'www.test.com',ip:'1.2.3.4', 
       labels: ['test1'],
       insertDate: new Date().toISOString(),
       updateDate: new Date().toISOString(),
       isEnabled: true,
       isExpanded: true
     }
     */
    this.getAllData().subscribe();
  }

  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }

  getAllData() {

    return this.dnsService.getRecord2(this.page, this.pageSize,).pipe(
      map(z => {
        this.records = z.items.sort((a, b) => a.fqdn.localeCompare(b.fqdn)).map(x => {
          x.objId = UtilService.randomNumberString();
          return x;
        })
      })
    )

  }

  search() {
    let search = this.searchKey.length > 1 ? this.searchKey : '';

    this.dnsService.getRecord2(this.page, this.pageSize, search).pipe(
      map(z => {
        this.totalRecords = z.total;
        this.records = z.items.sort((a, b) => a.fqdn.localeCompare(b.fqdn)).map(x => {
          x.objId = UtilService.randomNumberString();
          return x;
        })
      })
    ).subscribe();

  }
  addNewRecord() {
    const record: DnsRecord = {
      objId: UtilService.randomNumberString(),
      id: '', fqdn: '', ip: '', labels: [], isEnabled: true,
      isExpanded: true

    }
    this.records.unshift(record);
  }
  saveDnsRecord($event: DnsRecord) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.dnsService.saveOrupdateRecord($event)),
    ).subscribe((item) => {
      //find saved item and replace it
      const index = this.records.findIndex(x => x.objId == $event.objId);
      const oldObj = this.records[index];
      this.records[index] = {
        ...item,
        objId: oldObj.objId,
        isExpanded: true
      }
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }
  deleteDnsRecord($event: DnsRecord) {
    if (!$event.id) {//posture we created temporarily
      const index = this.records.findIndex(x => x.objId == $event.objId)
      if (index >= 0)
        this.records.splice(index, 1);

    } else {
      //real item execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.dnsService.deleteRecord($event)
        ),
      ).subscribe((x) => {
        //delete from  list
        const index = this.records.findIndex(x => x.objId == $event.objId);
        this.records.splice(index, 1);
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }

  }
  pageChanged($event: any) {
    this.pageSize = $event.pageSize;
    this.page = $event.pageIndex;
    this.search();
  }
}