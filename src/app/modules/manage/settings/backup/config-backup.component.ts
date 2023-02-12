import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { FileUploadComponent } from 'src/app/modules/shared/fileupload/fileupload.component';
import { HttpEventType } from '@angular/common/http';

export interface UploadModel {
  key: string
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
  private _model: UploadModel = { key: '' };
  public get model() {
    return this._model;

  }
  url = '/api/config/import';

  public set model(val: UploadModel) {
    this._model = {
      ...val
    }

    this.uploadFormGroup = this.createFormGroup(this._model);
  }
  @ViewChild(FileUploadComponent) fileupload!: FileUploadComponent;


  //es settings
  uploadFormGroup: FormGroup = this.createFormGroup(this.model);

  uploadError: { key: string } = { key: '' };

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
        key: new FormControl(model.key, [Validators.required]),
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
        this.checkIfModelChanged();
      })
    return fmg;
  }
  resetUploadErrors() {

    return {
      key: ''
    }
  }


  checkUploadFormError() {
    //check errors 
    this.uploadError = this.resetUploadErrors();
  }

  checkIfModelChanged() {

    let model = this.model as UploadModel;

  }





  clear() {

    this.uploadFormGroup = this.createFormGroup(this.model);
  }

  exportKey = '';
  importActivated = false;
  export() {
    this.importActivated = false;
    this.configService.export().subscribe(y => {

      this.notificationService.success(this.translateService.translate('Downloading'));
      this.exportKey = y.key;

    })
  }
  copyExportKey() {
    this.clipboard.copy(this.exportKey);
    this.notificationService.success(this.translateService.translate('Copied'));
  }

  preRestore() {
    this.fileupload?.reset();
    this.model = { key: '' };
    this.exportKey = '';
    this.importActivated = true;


  }
  uploadProgress = 0;
  restore(file: File) {

    if (!this.uploadFormGroup.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('config', file);
    this.configService.restore(this.model.key, formData).subscribe(event => {

      if (event.type == HttpEventType.UploadProgress) {
        if (event.total)
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      } else
        if (event.type == HttpEventType.Response)
          this.notificationService.success(this.translateService.translate('ConfigRestoredSuccessfuly'))
    })



  }



}
