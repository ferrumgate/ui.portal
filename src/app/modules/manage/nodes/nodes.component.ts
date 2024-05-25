import { Clipboard } from '@angular/cdk/clipboard';
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
import { CloudService } from '../../shared/services/cloud.service';
import { CloudConfig } from '../../shared/models/cloud';

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
  cloudConfig: CloudConfig = {
    ferrumCloudId: '', ferrumCloudToken: '', ferrumCloudUrl: '',
    ferrumCloudIp: '', ferrumCloudPort: '', clusterNodePublicKey: '', encryptKey: '',
    esIntelPass: '', esIntelUser: '', esPass: '', esUser: '', redisIntelPass: '', redisPass: ''
  };
  isThemeDark = false;
  clusterRestart = `ferrumgate --restart`;
  clusterUpgradeToWorker = `ferrumgate --upgrade-to-worker`;
  clusterSetConfigAll = '';
  clusterJoinToMaster = '';

  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private nodeService: NodeService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private cloudService: CloudService,
    private clipboard: Clipboard,
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

  hasCloudConfig() { return this.cloudConfig.ferrumCloudId && this.cloudConfig.ferrumCloudIp && this.cloudConfig.ferrumCloudPort; }


  getAllData() {
    // test data
    /* this.cloudConfig = {
      ferrumCloudId: '123', ferrumCloudToken: '123', ferrumCloudUrl: '123', ferrumCloudIp: '123', ferrumCloudPort: '123',
      clusterNodePublicKey: '123', encryptKey: '123', esIntelPass: '123 ', esIntelUser: '123',
      esPass: '123', esUser: '1234', redisIntelPass: '123', redisPass: '123'
    };
    this.nodeDetails = [
      {
        id: '123', freeMem: 2, interfaces: '', lastSeen: new Date().getTime(), platform: 'windows',
        release: '12', totalMem: 32, type: 'windows', version: '1.16.0', arch: 'x86',
        hostname: 'test1', roles: 'master',
      },
      {
        id: '124', freeMem: 2, interfaces: '', lastSeen: new Date().getTime(), platform: 'windows',
        release: '12', totalMem: 32, type: 'windows', version: '1.16.0',
        arch: 'x86', hostname: 'test2', roles: 'master',
      },
      {
        id: '125', freeMem: 2, interfaces: '', lastSeen: new Date().getTime(),
        platform: 'windows', release: '12', totalMem: 32, type: 'windows', version: '1.16.0',
        arch: 'x86', hostname: 'test3', roles: 'master',
      }
    ];
    this.nodes = [
      {
        id: '123', name: 'tet1', labels: [], insertDate: new Date().toISOString()
      },
      {
        id: '124', name: 'tet2', labels: [], insertDate: new Date().toISOString()
      },
      {
        id: '125', name: 'tet3', labels: [], insertDate: new Date().toISOString()
      }
    ]
    this.nodes.forEach(x => this.prepareNode(x));
    this.clusterSetConfigAll = `ferrumgate --set-config-all ${this.getClusterSetConfigAll()}`;
    this.clusterJoinToMaster = `ferrumgate --cluster-join ${this.getClusterJointToMaster()}`;

    return of(''); */


    return this.cloudService.getConfig().pipe(
      map(y => {
        this.cloudConfig = y;
      }),
      switchMap(y => this.nodeService.getAliveAll()),
      map(y => {
        this.nodeDetails = y.items;
      }),
      switchMap(y => this.nodeService.get2()),
      map(z => {
        this.nodes = z.items.map(x => {
          return this.prepareNode(x);
        });
        this.nodes = this.nodes.sort(x => new Date(x.insertDate).getTime());
      }),
      map(z => {
        this.clusterSetConfigAll = `ferrumgate --set-config-all ${this.getClusterSetConfigAll()}`;
        this.clusterJoinToMaster = `ferrumgate --cluster-join ${this.getClusterJointToMaster()}`;
      })
    )

  }

  public getClusterJointToMaster() {
    let masterNode = this.nodes.find(x => x.detail.roles.includes('master'));
    if (!masterNode) return '';
    let masterNodeDetail = masterNode.detail as NodeDetail;
    if (!masterNodeDetail) return '';

    return `PEERW=${masterNode.name}/${this.cloudConfig.ferrumCloudIp}:${this.cloudConfig.ferrumCloudPort}/${masterNodeDetail.nodeIpw}/${this.cloudConfig.clusterNodePublicKey}`
  }

  public getClusterSetConfigAll() {
    if (!this.nodes.length) return '';


    const leftSide = [
      `ENCRYPT_KEY=${this.cloudConfig.encryptKey}`,
      `REDIS_PASS=${this.cloudConfig.redisPass}`,
      `REDIS_INTEL_PASS=${this.cloudConfig.redisIntelPass}`,
      `ES_USER=${this.cloudConfig.esUser}`,
      `ES_PASS=${this.cloudConfig.esPass}`,
      `ES_INTEL_USER=${this.cloudConfig.esIntelUser}`,
      `ES_INTEL_PASS=${this.cloudConfig.esIntelPass}`,
      `FERRUM_CLOUD_ID=${this.cloudConfig.ferrumCloudId}`,
      `FERRUM_CLOUD_URL=${this.cloudConfig.ferrumCloudUrl}`,
      `FERRUM_CLOUD_TOKEN=${this.cloudConfig.ferrumCloudToken}`,
      `CLUSTER_NODE_PUBLIC_KEY=${this.cloudConfig.clusterNodePublicKey}`,
    ].join('\n');

    return btoa(leftSide);

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

    if (!$event.id) {//node we created temporarily


    } else {
      //real node execute
      this.confirmService.showDelete().pipe(
        takeWhile(x => x),
        switchMap(y =>
          this.nodeService.delete($event)
        ),
      ).subscribe(() => {
        //delete from network list
        const index = this.nodes.findIndex(x => x.objId == $event.objId);
        this.nodes.splice(index, 1);

        this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'))
      });
    }
  }

  copyClusterGlobalConfig() {
    if (this.clusterSetConfigAll) {
      this.clipboard.copy(this.clusterSetConfigAll + '\n' + this.clusterRestart);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

  copyClusterUpdateToWorker() {
    if (this.clusterUpgradeToWorker) {
      this.clipboard.copy(this.clusterUpgradeToWorker + '\n' + this.clusterRestart);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }
  copyJoinToCluster() {
    if (this.clusterJoinToMaster) {
      this.clipboard.copy(this.clusterJoinToMaster + '\n' + this.clusterRestart);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }
}

