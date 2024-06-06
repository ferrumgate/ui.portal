import { Clipboard } from '@angular/cdk/clipboard';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { SSubscription } from '../services/SSubscribtion';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { Node, NodeDetail } from '../models/node';

export interface NodeWithDetail extends Node {
  version: string;
  lastSeen: number;
  lastSeenDate: string;
  roles: string;
  insertDateByNumber: number
  nodeIp: string;
  nodePort: string;
  nodeIpw: string;
  nodePortw: string;
}

export interface NodeExtended extends NodeWithDetail {
  orig: Node;
  isChanged: boolean;

}

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})

export class NodeComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';
  _node: NodeWithDetail =
    {
      id: '', name: '', labels: [],
      insertDate: '',
      insertDateByNumber: 0,
      isChanged: false, lastSeen: 0, lastSeenDate: new Date(1, 1, 1).toString(),
      version: '', roles: '',
      nodeIp: '', nodePort: '', nodeIpw: '', nodePortw: ''

    };

  get node() {
    return this._node;
  }

  @Input()
  nodeDetail: NodeDetail | null = null;

  @Input()
  set node(val: Node) {
    this._node = {
      ...val,
      isChanged: false,
      orig: val,
      insertDateByNumber: new Date(val.insertDate).getTime(),
      lastSeen: this.nodeDetail?.lastSeen || 0,
      lastSeenDate: this.nodeDetail ? new Date(this.nodeDetail?.lastSeen).toLocaleString() : new Date(1, 1, 1).toLocaleString(),
      version: this.nodeDetail?.version || '',
      roles: this.nodeDetail?.roles || '',
      nodeIp: this.nodeDetail?.nodeIp || '',
      nodePort: this.nodeDetail?.nodePort || '',
      nodeIpw: this.nodeDetail?.nodeIpw || '',
      nodePortw: this.nodeDetail?.nodePortw || ''
    }
    this.node.labels = Array.from(val.labels);
    this.formGroup = this.createFormGroup(this.node);
  }

  @Output()
  saveNode: EventEmitter<Node> = new EventEmitter();
  @Output()
  deleteNode: EventEmitter<Node> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this.node);
  formError: { name: string, lastSeenDate: string } =
    { name: '', lastSeenDate: '' }


  enabledFormControl = new FormControl();
  isThemeDark = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private clipboard: Clipboard, private notificationService: NotificationService
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';
    //for testing;
    //this.node = this.prepareModel(this.node);
    this.helpLink = this.configService.links.nodeHelp;
  }

  ngOnInit(): void {


  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }


  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }



  createFormGroup(node: Node) {
    const fmg = new FormGroup({
      name: new FormControl(node.name, [Validators.required]),
      id: new FormControl(node.id, []),
      lastSeenDate: new FormControl(node.lastSeenDate, []),
      version: new FormControl(node.version, []),
      roles: new FormControl(node.roles, []),
      nodeIp: new FormControl(node.nodeIp, []),
      nodePort: new FormControl(node.nodePort, []),
      nodeIpw: new FormControl(node.nodeIpw, []),
      nodePortw: new FormControl(node.nodePortw, []),

    });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.node as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.nodeModelChanged();
      })
    return fmg;
  }
  createFormError() {
    return { name: '', lastSeenDate: '' };
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const isExits = this.node.labels.find(x => x == value);
      if (!isExits)
        this.node.labels.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
  }

  removeLabel(label: string): void {
    this.node.labels = this.node.labels.filter(x => x != label);
    if (this.formGroup.valid)
      this.checkIfModelChanged();

  }

  nodeModelChanged() {
    this.checkNodeFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.node.isChanged = false;

  }
  checkIfModelChanged() {
    this.node.isChanged = false;
    const original = this.node.orig as Node;

    if (original.name != this.node.name)
      this.node.isChanged = true;
    if (UtilService.checkChanged(original.labels, this.node.labels))
      this.node.isChanged = true;
    if (original.isEnabled != this.node.isEnabled)
      this.node.isChanged = true;
    if (original.nodeId != this.node.nodeId)
      this.node.isChanged = true;

  }

  checkNodeFormError() {
    //check errors 
    let error = this.createFormError();

    const nameError = this.formGroup.controls['name'].errors;

    if (nameError) {
      if (nameError['required'])
        error.name = 'NameRequired';
      else
        error.name = 'NameRequired';
    }

    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this.node.isChanged = false;
    const original = this.node.orig as Node;

    this.node = {
      ...original
    }
    this.checkIfModelChanged();
  }

  saveOrUpdate() {
    this.saveNode.emit(this.node);
  }



  delete() {
    this.deleteNode.emit(this.node);
  }

  copyNodeId() {
    if (this.node.id) {
      this.clipboard.copy(this.node.id);
      this.notificationService.success(this.translateService.translate('Copied'));
    }
  }

}
