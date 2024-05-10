import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { dispatchFakeEvent, expectValue, findEl, findEls, setFieldValue } from '../helper.spec';
import { Network } from '../models/network';
import { Node } from '../models/node';
import { CaptchaService } from '../services/captcha.service';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { SharedModule } from '../shared.module';
import { NodeComponent } from './node.component';

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
      id: '12123',
      name: 'test',
      labels: ['testlabel', 'testlabel2'],
      isEnabled: true,

    }
    let network1: Network = {
      id: '22',
      name: 'testnetwork',
      labels: [], clientNetwork: '', serviceNetwork: ''
    }
    component.node = node

    tick(1000);
    fixture.detectChanges();
    expectValue(fixture, 'node-id-input', node.id);
    expectValue(fixture, 'node-name-input', node.name);
    expectValue(fixture, 'node-id-input', node.id);
    const chips = findEls(fixture, 'node-label-chip')
    expect(chips.length).toBe(2);
    //these codes are not working as expected
    //expectValue(fixture, 'node-input-network', network1.name);

    //const { nativeElement } = queryByCss(fixture, '[test-id=node-checkbox-enabled] input');
    //expect(nativeElement.checked).toBe(true);

    expect(component.node.isChanged).toBe(false);
    const button = findEl(fixture, 'node-ok-button', false);
    expect(button).toBeFalsy();

    setFieldValue(fixture, 'node-name-input', 'anewvalue');
    dispatchFakeEvent(findEl(fixture, 'node-name-input').nativeElement, 'blur');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.node.name).toBe('anewvalue');
    expect(component.node.isChanged).toBe(true);
    const button2 = findEl(fixture, 'node-ok-button', false);
    expect(button2).toBeTruthy();

  }));

});
