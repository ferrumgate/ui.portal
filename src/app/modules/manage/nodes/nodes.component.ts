import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, of, switchMap, takeWhile } from 'rxjs';
import { SSubscription } from '../../shared/services/SSubscribtion';
import { ConfigService } from '../../shared/services/config.service';
import { ConfirmService } from '../../shared/services/confirm.service';
import { NodeService } from '../../shared/services/node.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslationService } from '../../shared/services/translation.service';
import { UtilService } from '../../shared/services/util.service';
import { Node, NodeDetail } from '../../shared/models/node'

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements OnInit, OnDestroy {

  nodesNotJoinedpanelOpenState = true;
  searchForm = new FormControl();
  allSubs: SSubscription = new SSubscription();
  nodes: Node[] = [];
  nodeDetails: NodeDetail[] = [];
  isThemeDark = false;
  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private nodeService: NodeService,
    private confirmService: ConfirmService,
    private configService: ConfigService
  ) {
    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //search input with wait
    this.allSubs.addThis =
      this.searchForm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(newMessage => {

      });
  }

  ngOnInit(): void {

    this.getAllData().subscribe();
  }
  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }

  prepareNode(node: Node) {
    let nodeDetail: NodeDetail = {
      freeMem: 0, id: node.id, interfaces: '', lastSeen: 0, platform: '', release: '', totalMem: 0, type: '', version: ''
    }
    node.objId = UtilService.randomNumberString();
    node.detail = this.nodeDetails.find(x => x.id == node.id) || nodeDetail;
    return node;
  }


  getAllData() {
    // test data
    /* this.nodeDetails = [
      {
        id: '123', freeMem: 2, interfaces: '', lastSeen: new Date().getTime(), platform: 'windows', release: '12', totalMem: 32, type: 'windows', version: '1.16.0', arch: 'x86', hostname: 'test1', roles: 'master'
      },
      {
        id: '124', freeMem: 2, interfaces: '', lastSeen: new Date().getTime(), platform: 'windows', release: '12', totalMem: 32, type: 'windows', version: '1.16.0', arch: 'x86', hostname: 'test2', roles: 'master'
      },
      {
        id: '125', freeMem: 2, interfaces: '', lastSeen: new Date().getTime(), platform: 'windows', release: '12', totalMem: 32, type: 'windows', version: '1.16.0', arch: 'x86', hostname: 'test3', roles: 'master'
      }
    ];
    this.nodes = [
      {
        id: '123', name: 'tet1', labels: []
      },
      {
        id: '124', name: 'tet2', labels: []
      },
      {
        id: '125', name: 'tet3', labels: []
      }
    ]
    this.nodes.forEach(x => this.prepareNode(x));
    return of(''); */
    return this.nodeService.getAliveAll().pipe(
      map(y => {
        this.nodeDetails = y.items;
      }),
      switchMap(y => this.nodeService.get2()),
      map(z => {
        this.nodes = z.items.map(x => {
          return this.prepareNode(x);
        });
      }))
  }




  saveNode($event: Node) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.nodeService.saveOrupdate($event)),
    ).subscribe((item) => {

      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    });
  }

  deleteNode($event: Node) {

    if (!$event.id) {//network we created temporarily


    } else {
      //real network execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.nodeService.delete($event)
        ),
      ).subscribe(() => {
        //delete from network list
        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }
}
