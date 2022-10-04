import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, takeWhile } from 'rxjs';
import { ConfigCommon } from 'src/app/modules/shared/models/config';

import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { ThemeSelectorComponent } from 'src/app/modules/shared/themeselector/themeselector.component';

interface BaseModel extends ConfigCommon {
  isChanged: boolean
}
interface Model extends BaseModel {


  orig: ConfigCommon
}

@Component({
  selector: 'app-config-common',
  templateUrl: './config-common.component.html',
  styleUrls: ['./config-common.component.scss']
})
export class ConfigCommonComponent implements OnInit, AfterViewInit {



  isThemeDark = false;
  private _model: Model = { url: '', domain: '', isChanged: false, orig: { url: '', domain: '' } };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      url: val.url,
      domain: val.domain,
      isChanged: false,
      orig: val
    }
    this.commonFormGroup = this.createFormGroup(this._model);
  }

  helpLink = '';

  //common settings
  commonFormGroup: FormGroup = this.createFormGroup(this.model);

  commonError: { url: string, domain: string } = { url: '', domain: '' };
  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';


    this.helpLink = this.configService.links.commonHelp;

  }



  ngOnInit(): void {
    this.configService.getCommonConfig().pipe().subscribe(x => {
      this.model = { ...x, isChanged: false };
    })

  }
  ngAfterViewInit(): void {

  }

  createFormGroup(model: any) {
    return new FormGroup(
      {
        domain: new FormControl(model.domain, [Validators.required, InputService.domainValidator]),
        url: new FormControl(model.url, [Validators.required, InputService.urlValidator]),
      });
  }
  resetCommonErrors() {

    return {
      domain: '', url: ''
    }
  }

  commonModelChanged($event: any) {
    this.checkCommonFormError();
    if (this.commonFormGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }
  getError(prop: string) {
    this.checkCommonFormError();
    return this.commonError.domain;
  }
  checkCommonFormError() {
    //check errors 
    this.commonError = this.resetCommonErrors();

    const domainError = this.commonFormGroup.controls['domain'].errors;

    if (domainError) {
      if (domainError['required'])
        this.commonError.domain = 'DomainRequired';
      else
        this.commonError.domain = 'DomainInvalid';
    }

    const urlError = this.commonFormGroup.controls['url'].errors;
    if (urlError) {
      if (urlError['required'])
        this.commonError.url = 'UrlRequired';
      else
        this.commonError.url = 'UrlInvalid';
    }

  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.domain != model.domain)
      model.isChanged = true;
    if (original.url != model.url)
      model.isChanged = true;

  }





  clear() {
    this.model.domain = (this.model as Model).orig.domain;
    this.model.url = (this.model as Model).orig.url;
    this.model.isChanged = false;
  }


  saveOrUpdate() {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveCommonConfig(this.model))
    ).subscribe(y => {
      (this.model as Model).orig = y;
      this.model.isChanged = false;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }

  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }



}
