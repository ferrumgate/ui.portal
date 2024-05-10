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

describe('NodesComponent', () => {
  let component: NodesComponent;
  let fixture: ComponentFixture<NodesComponent>;
  let httpClient: HttpClient;
  let captchaSpy = jasmine.createSpyObj('CaptchaService', ['executeIfEnabled']);
  let confirmService = jasmine.createSpyObj('ConfirmService', ['showSave', 'showDelete']);
  let gatewayService: GatewayService;
  let networkService: NetworkService;
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
    networkService = TestBed.inject(NetworkService);
    gatewayService = TestBed.inject(GatewayService);

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
    let net: Network = {
      objId: UtilService.randomNumberString(),
      id: '312', name: 'ops3', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24'
    }
    let gateways: Gateway[] = [
      { objId: UtilService.randomNumberString(), id: '123', networkId: net.id, name: 'blac', labels: ['testme'], isEnabled: true },
      { objId: UtilService.randomNumberString(), id: '1234', networkId: net.id, name: 'blac2', labels: ['testme2'], isEnabled: true },
      { objId: UtilService.randomNumberString(), id: '12345', networkId: net.id, name: 'blac3', labels: ['testme3'], isEnabled: true }
    ]

    let thisnetworks: Network[] = [];
    let thisgateways: Gateway[] = [];
    let thisgatewaysNotJoined: Gateway[] = [];

    let item = net;
    thisnetworks.push(item);
    gateways.forEach(x => {
      const extendedGateway = x;
      extendedGateway.orig = x;
      item.gatewaysCount++;
      extendedGateway.networkName = net.name;
      thisgateways.push(extendedGateway);
    })

    let net2: Network = {
      objId: UtilService.randomNumberString(),
      id: '3123', name: 'ops2', labels: ['deneme2'], serviceNetwork: '1.1.1.1/16',

      clientNetwork: '1.2.3.4/24'
    }
    let item2 = net2;
    thisnetworks.push(item2);

    const notJoinedGateway: Gateway = {
      objId: UtilService.randomNumberString(),
      id: '1234', networkId: '',
      name: 'not joined ', labels: ['testme'], isEnabled: true,
      orig: {
        id: '1234', networkId: '',
        name: 'not joined ', labels: ['testme'], isEnabled: true,
      }
    };
    const notJoinedExtendedGateway = notJoinedGateway;
    thisgatewaysNotJoined.push(notJoinedExtendedGateway);

    const notJoinedGateway2: Gateway = {
      objId: UtilService.randomNumberString(),
      id: '12344', networkId: '',
      name: 'not joined2 ', labels: ['testme'], isEnabled: true,
      orig: {
        id: '12344', networkId: '',
        name: 'not joined2 ', labels: ['testme'], isEnabled: true,
      }

    };
    const notJoinedExtendedGateway2 = notJoinedGateway2;
    thisgatewaysNotJoined.push(notJoinedExtendedGateway2);
    return { networks: thisnetworks, gateways: thisgateways, gatewaysNotJoined: thisgatewaysNotJoined };
  }

  /*  it('gatewaysnotjoined must be seen', fakeAsync(async () => {
     expect(component).toBeTruthy();
     const data = createSampleData();
     component.gatewaysNotJoined = data.gatewaysNotJoined;
     tick(1000);
     fixture.detectChanges();
     const element = findEl(fixture, 'networks-gatewaynotjoined-accordion', false);
     expect(element).toBeTruthy();
 
     const elements = findEls(fixture, 'networks-gatewaynotjoined-app-gateway');
     expect(elements.length).toBe(2);
 
   }));
 
   it('addNewNetwork', fakeAsync(async () => {
     expect(component).toBeTruthy();
 
     component.addNewNetwork();
     tick(1000);
     fixture.detectChanges();
     const elements = findEls(fixture, 'networks-app-network');
     expect(elements.length).toBe(1);
 
   }));
 
   it('networks count', fakeAsync(async () => {
     expect(component).toBeTruthy();
     const data = createSampleData();
     component.networks = data.networks;
     component.gateways = data.gateways;
     tick(1000);
     fixture.detectChanges();
     const elements = findEls(fixture, 'networks-app-network');
     expect(elements.length).toBe(2);
 
   }));
 
   it('networks gateway count', fakeAsync(async () => {
     expect(component).toBeTruthy();
     const data = createSampleData();
     component.networks = data.networks;
     component.gateways = data.gateways;
     component.networks[0].isGatewayOpened = true;
     tick(1000);
     fixture.detectChanges();
     const elements = findEls(fixture, 'networks-app-network-app-gateway');
     expect(elements.length).toBe(3);
 
   }));
 
   it('change gateway network', fakeAsync(async () => {
     expect(component).toBeTruthy();
     const data = createSampleData();
     component.networks = data.networks;
     component.gateways = data.gateways;
     component.networks[0].isGatewayOpened = true;
     tick(1000);
     fixture.detectChanges();
 
     //find a gateway
     const gateway = component.gateways.find(x => x.networkId == component.networks[0].id);
     if (!gateway) throw Error('must found');
     let savedGateway: Gateway = { id: gateway.id, labels: gateway.labels, name: gateway.name, isEnabled: gateway.isEnabled };
     //    spyOn(httpClient, 'put').and.returnValue(of(savedGateway));
     //clear network relation
     gateway.networkId = ''
     const saveOrUpdate = spyOn(gatewayService, 'saveOrupdate')
     saveOrUpdate.and.returnValue(of(savedGateway));
     component.saveGateway(gateway);
     tick(1000);
     fixture.detectChanges();
     // gateway not joined must be visible
     const accordion = findEl(fixture, 'networks-gatewaynotjoined-accordion', false);
     expect(accordion).toBeTruthy();
 
     tick(1000);
     fixture.detectChanges();
     // and gateway component must be there
     const elements = findEls(fixture, 'networks-gatewaynotjoined-app-gateway');
     expect(elements.length).toBe(1);
 
     component.networks[0].isGatewayOpened = true;
     tick(1000);
     fixture.detectChanges();
     // networks gateway count must be from 3 to 2
     const elements2 = findEls(fixture, 'networks-app-network-app-gateway');
     expect(elements2.length).toBe(2);
 
     //and move gateway back by selecting network again
     const gateway2 = component.gatewaysNotJoined[0];
     if (!gateway2) throw new Error('not found')
     gateway2.networkId = component.networks[0].id;
 
     let savedGateway2: Gateway = { id: gateway2.id, labels: gateway2.labels, name: gateway2.name, isEnabled: gateway2.isEnabled, networkId: gateway2.networkId };
     saveOrUpdate.and.returnValue(of(savedGateway2));
 
     component.saveGateway(gateway2);
     tick(1000);
     fixture.detectChanges();
     // gateway not joined must be visible
     const accordion2 = findEl(fixture, 'networks-gatewaynotjoined-accordion', false);
     expect(accordion2).toBeFalsy();
 
     tick(1000);
     fixture.detectChanges();
     // and gateway component must be there
     const elements22 = findEls(fixture, 'networks-gatewaynotjoined-app-gateway');
     expect(elements22.length).toBe(0);
 
     component.networks[0].isGatewayOpened = true;
     tick(1000);
     fixture.detectChanges();
     // gateway count must be from 3 to 2
     const elements3 = findEls(fixture, 'networks-app-network-app-gateway');
     expect(elements3.length).toBe(3);
 
   })); */

});
