import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldValue } from '../helper.spec';
import { Network } from '../models/network';
import { Node, NodeDetail } from '../models/node';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { NodeComponent } from './node.component';
import { UtilService } from '../services/util.service';

describe(' NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(),
        NoopAnimationsModule, SharedModule, RecaptchaV3Module, MatIconTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        ConfigService,
        TranslationService, NotificationService,
        CaptchaService,
        ReCaptchaV3Service,
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: '',

        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('data binding', fakeAsync(async () => {

    expect(component).toBeTruthy();
    let node: Node = {
      objId: UtilService.randomNumberString(),
      id: '123', name: 'ops1', labels: ['deneme2'],
      insertDate: new Date().toISOString(), lastSeen: new Date().toISOString(), status: 'active', type: 'windows'
    };

    let nodeDetail: NodeDetail = {
      id: '123', hostname: 'fs1', roles: 'master', lastSeen: new Date().getTime(), freeMem: 0, interfaces: '', platform: 'windows', release: '12', totalMem: 3, type: 'windows', version: '1.16.0',

    };
    component.nodeDetail = nodeDetail;
    component.node = node;

    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'node-id-input', node.id);
    const chips = findEls(fixture, 'node-label-chip')
    expect(chips.length).toBe(1);
    expectValue(fixture, 'node-hostname-input', node.name || '');
    expectValue(fixture, 'node-roles-input', nodeDetail.roles || '');
    expectValue(fixture, 'node-version-input', nodeDetail.version || '');
    expectValue(fixture, 'node-ip-input', nodeDetail.nodeIp || '');
    expectValue(fixture, 'node-port-input', nodeDetail.nodePort || '');
    expectValue(fixture, 'node-ipw-input', nodeDetail.nodeIpw || '');
    expectValue(fixture, 'node-portw-input', nodeDetail.nodePortw || '');









  }));

});
