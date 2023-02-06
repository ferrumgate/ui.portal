import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigES } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { Clipboard } from '@angular/cdk/clipboard';

export interface Model {

}

@Component({
  selector: 'app-config-backup',
  templateUrl: './config-backup.component.html',
  styleUrls: ['./config-backup.component.scss']
})
export class ConfigBackupComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';


  isThemeDark = false;
  private _model: Model = {};
  public get model() {
    return this._model;

  }
  public set model(val: Model) {
    this._model = {
      ...val
    }

    this.backupFormGroup = this.createFormGroup(this._model);
  }


  //es settings
  backupFormGroup: FormGroup = this.createFormGroup(this.model);

  backupError: {} = {};

  constructor(private router: Router, private clipboard: Clipboard,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {


    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';



    this.helpLink = this.configService.links.backupHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {


  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
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

      })
    return fmg;
  }
  resetBackupErrors() {

    return {

    }
  }


  checkBackupFormError() {
    //check errors 
    this.backupError = this.resetBackupErrors();
  }

  checkIfModelChanged() {

    let model = this.model as Model;
  }





  clear() {

    this.backupFormGroup = this.createFormGroup(this.model);
  }


  exportKey = '';
  export() {
    this.configService.export().subscribe(y => {

      this.notificationService.success(this.translateService.translate('Downloading'));
      this.exportKey = y.key;

    })
  }
  copyExportKey() {
    this.clipboard.copy(this.exportKey);
    this.notificationService.success(this.translateService.translate('Copied'));
  }

}
