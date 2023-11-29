import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../models/group';
import { ConfigService } from '../services/config.service';
import { SSubscription } from '../services/SSubscribtion';
import { TranslationService } from '../services/translation.service';
import { UtilService } from '../services/util.service';
import { map, switchMap, takeWhile } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { ConfirmService } from '../services/confirm.service';
import { UserService } from '../services/user.service';
import { UserProfile } from '../models/userProfile';


export interface Model extends UserProfile {
  isChanged: boolean;
  orig: UserProfile
}

// user profile
@Component({
  selector: 'app-uprofile',
  templateUrl: './uprofile.component.html',
  styleUrls: ['./uprofile.component.scss']
})
export class UProfileComponent implements OnInit, OnDestroy {


  @Output()
  saveUserProfile: EventEmitter<UserProfile> = new EventEmitter();
  private allSubs = new SSubscription();

  isThemeDark = false;


  help = {

  }

  private _model: Model;
  public get model(): Model {
    return this._model;

  }
  @Input()
  public set model(val: UserProfile) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,

    }


    this.formGroup = this.createFormGroup(this._model);

  }



  constructor(
    private translateService: TranslationService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private configService: ConfigService,
    private userService: UserService
  ) {

    this._model = {
      browserTimeout: 15, isChanged: false, orig: { browserTimeout: 15 }
    }
    this.formGroup = this.createFormGroup(this.model);

    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.allSubs.addThis =
      this.allSubs.addThis = this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })


  }
  ngOnInit(): void {



  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.allSubs.unsubscribe();
  }

  formGroup: FormGroup;
  error = { browserTimeout: '' };


  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        browserTimeout: new FormControl(model.browserTimeout, [])
      });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSubs.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSubs.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;
  }

  resetErrors() {

    return {
      browserTimeout: ''
    }
  }

  modelChanged($event?: any) {

    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.model.isChanged = false;

  }

  checkFormError() {

    //check errors 
    this.error = this.resetErrors();

    const browserTimeoutError = this.formGroup.controls.browserTimeout.errors;
    if (browserTimeoutError) {
      if (browserTimeoutError['required'])
        this.error.browserTimeout = 'BrowserTimeoutRequired';
      else
        this.error.browserTimeout = 'BrowserTimeoutRequired';
    }


  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.browserTimeout != model.browserTimeout)
      model.isChanged = true;

  }


  clear() {

    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;
    this.formGroup.markAsUntouched();
  }




  createBaseModel(): UserProfile {
    return {
      browserTimeout: this.model.browserTimeout
    }
  }


  saveOrUpdate() {

    this.saveUserProfile.emit(this.createBaseModel());
  }


}
