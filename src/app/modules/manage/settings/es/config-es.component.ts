import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

interface BaseModel extends ConfigES {
  isChanged: boolean
}
interface Model extends BaseModel {

  orig: ConfigES
}

@Component({
  selector: 'app-config-es',
  templateUrl: './config-es.component.html',
  styleUrls: ['./config-es.component.scss']
})
export class ConfigESComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  isThemeDark = false;
  private _model: Model = { host: '', user: '', pass: '', deleteOldRecordsMaxDays: 0, isChanged: false, orig: { host: '', user: '', pass: '', deleteOldRecordsMaxDays: 0 } };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      host: val.host,
      user: val.user,
      pass: val.pass,
      deleteOldRecordsMaxDays: val.deleteOldRecordsMaxDays,
      isChanged: false,
      orig: val
    }

    this.esFormGroup = this.createFormGroup(this._model);
  }

  //es settings
  esFormGroup: FormGroup = this.createFormGroup(this.model);

  esError: { host: string, user: string, pass: string, deleteOldRecordsMaxDays: string } = { host: '', user: '', pass: '', deleteOldRecordsMaxDays: '' };

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.esHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {
    this.configService.getES().pipe().subscribe(x => {
      this.model = { ...x, isChanged: false };
    })

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        host: new FormControl(model.host, []),
        user: new FormControl(model.user, []),
        pass: new FormControl(model.pass, []),
        deleteOldRecordsMaxDays: new FormControl(model.deleteOldRecordsMaxDays, []),

      });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this._model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.esModelChanged();
      })
    return fmg;
  }
  resetESErrors() {

    return {
      host: '', user: '', pass: '', deleteOldRecordsMaxDays: ''
    }
  }

  esModelChanged() {
    this.checkESFormError();
    if (this.esFormGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }

  checkESFormError() {
    //check errors 
    this.esError = this.resetESErrors();

  }

  checkIfModelChanged() {

    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.host != model.host)
      model.isChanged = true;
    if (original.user != model.user)
      model.isChanged = true;
    if (original.pass != model.pass)
      model.isChanged = true;
    if (original.deleteOldRecordsMaxDays != model.deleteOldRecordsMaxDays)
      model.isChanged = true;

  }

  clear() {
    this.model.host = (this.model as Model).orig.host;
    this.model.user = (this.model as Model).orig.user;
    this.model.pass = (this.model as Model).orig.pass;
    this.model.deleteOldRecordsMaxDays = (this.model as Model).orig.deleteOldRecordsMaxDays;
    this.model.isChanged = false;
    this.esFormGroup = this.createFormGroup(this.model);
  }

  saveOrUpdate() {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveES(this.model))
    ).subscribe(y => {
      (this.model as Model).orig = y;
      this.model.isChanged = false;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }

  canDelete() {
    if (this.esFormGroup.valid && !this.model.isChanged && (this.model.host || this.model.user || this.model.pass))
      return true;
    return false;
  }

  delete() {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveES({ host: '', user: '', pass: '', deleteOldRecordsMaxDays: this.model.deleteOldRecordsMaxDays }))
    ).subscribe(y => {
      this.model.host = y.host;
      this.model.user = y.user;
      this.model.pass = y.pass;
      this.model.deleteOldRecordsMaxDays = y.deleteOldRecordsMaxDays;
      (this.model as Model).orig = y;
      this.model.isChanged = false;

      this.esFormGroup = this.createFormGroup(this.model);
      this.esFormGroup.markAsUntouched();
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
    })
  }

  canCheck() {
    if (this.model.isChanged && this.model.host) {
      return true;
    }
    return false;
  }
  checkES() {
    this.configService.checkES({

      host: this.model.host, user: this.model.user, pass: this.model.pass
    }).subscribe(y => {
      if (y.error)
        this.notificationService.error(y.error);
      else
        this.notificationService.success(this.translateService.translate('SuccessfullyWorking'));

    })
  }

}
