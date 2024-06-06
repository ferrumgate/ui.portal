import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { of } from 'rxjs';
import { findEl, findEls } from '../../shared/helper.spec';
import { Gateway, Network } from '../../shared/models/network';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CaptchaService } from '../../shared/services/captcha.service';
import { ConfirmService } from '../../shared/services/confirm.service';
import { GatewayService } from '../../shared/services/gateway.service';
import { NetworkService } from '../../shared/services/network.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TranslationService } from '../../shared/services/translation.service';
import { UtilService } from '../../shared/services/util.service';
import { SharedModule } from '../../shared/shared.module';
import { NodesComponent } from './nodes.component';
import { Node, NodeDetail } from '../../shared/models/node';
import { NodeService } from '../../shared/services/node.service';

describe('NodesComponent', () => {
  let component: NodesComponent;
  let fixture: ComponentFixture<NodesComponent>;
  let httpClient: HttpClient;
  let captchaSpy = jasmine.createSpyObj('CaptchaService', ['executeIfEnabled']);
  let confirmService = jasmine.createSpyObj('ConfirmService', ['showSave', 'showDelete']);
  let nodeService: NodeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodesComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        HttpClient,
        { provide: ConfirmService, useValue: confirmService },
        AuthenticationService,
        TranslationService,
        NotificationService,
        { provide: CaptchaService, useValue: captchaSpy },
        GatewayService,
        NetworkService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(NodesComponent);
    nodeService = TestBed.inject(NodeService);

    component = fixture.componentInstance;
    captchaSpy.executeIfEnabled.and.returnValue(of(false));
    confirmService.showSave.and.returnValue(of(true));
    confirmService.showDelete.and.returnValue(of(true));
    spyOn(httpClient, 'get').and.returnValue(of({ items: [] }))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function createSampleData() {
    let nodes: Node[] = [
      { objId: UtilService.randomNumberString(), id: '123', name: 'ops1', labels: ['deneme2'], insertDate: '' },
      { objId: UtilService.randomNumberString(), id: '1234', name: 'ops2', labels: ['deneme2'], insertDate: '' },
      { objId: UtilService.randomNumberString(), id: '12345', name: 'ops3', labels: ['deneme2'], insertDate: '' },

    ];

    let nodeDetails: NodeDetail[] = [
      { id: '123', hostname: 'fs1', lastSeen: new Date().getTime(), freeMem: 0, interfaces: '', platform: 'windows', release: '12', totalMem: 3, type: 'windows', version: '1.16.0' },
      { id: '1234', hostname: 'fs2', lastSeen: new Date().getTime(), freeMem: 0, interfaces: '', platform: 'windows', release: '12', totalMem: 3, type: 'windows', version: '1.16.0' },
      { id: '1235', hostname: 'fs3', lastSeen: new Date().getTime(), freeMem: 0, interfaces: '', platform: 'windows', release: '12', totalMem: 3, type: 'windows', version: '1.16.0' },
      { id: '1236', hostname: 'fs4', lastSeen: new Date().getTime(), freeMem: 0, interfaces: '', platform: 'windows', release: '12', totalMem: 3, type: 'windows', version: '1.16.0' },

    ]
    //nodes.forEach(x => x.detail = nodeDetails.find(y => y.id == x.id));

    return { nodes: nodes, nodeDetails: nodeDetails }
  }

});
