import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigCaptcha } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

interface BaseModel extends ConfigCaptcha {
  isChanged: boolean
}
interface Model extends BaseModel {

  orig: ConfigCaptcha
}

@Component({
  selector: 'app-config-captcha',
  templateUrl: './config-captcha.component.html',
  styleUrls: ['./config-captcha.component.scss']
})
export class ConfigCaptchaComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  isThemeDark = false;
  private _model: Model = { server: '', client: '', isChanged: false, orig: { server: '', client: '' } };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      server: val.server,
      client: val.client,
      isChanged: false,
      orig: val
    }
    this.captchaFormGroup = this.createFormGroup(this._model);
  }

  //captcha settings
  captchaFormGroup: FormGroup = this.createFormGroup(this.model);

  captchaError: { server: string, client: string } = { server: '', client: '' };

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

    this.helpLink = this.configService.links.captchaHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {
    this.configService.getCaptcha().pipe().subscribe(x => {
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
        server: new FormControl(model.server, []),
        client: new FormControl(model.client, []),
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
        this.captchaModelChanged();
      })
    return fmg;
  }
  resetCaptchaErrors() {

    return {
      server: '', client: ''
    }
  }

  captchaModelChanged() {
    this.checkCaptchaFormError();
    if (this.captchaFormGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }

  checkCaptchaFormError() {
    //check errors 
    this.captchaError = this.resetCaptchaErrors();

  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.server != model.server)
      model.isChanged = true;
    if (original.client != model.client)
      model.isChanged = true;

  }

  clear() {
    this.model.server = (this.model as Model).orig.server;
    this.model.client = (this.model as Model).orig.client;
    this.model.isChanged = false;
    this.captchaFormGroup = this.createFormGroup(this.model)
  }

  saveOrUpdate() {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveCaptcha(this.model))
    ).subscribe(y => {
      (this.model as Model).orig = y;
      this.model.isChanged = false;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }

  canDelete() {
    if (this.captchaFormGroup.valid && !this.model.isChanged && (this.model.client || this.model.server))
      return true;
    return false;
  }

  delete() {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveCaptcha({ server: '', client: '' }))
    ).subscribe(y => {
      this.model.client = y.client;
      this.model.server = y.server;
      (this.model as Model).orig = y;
      this.model.isChanged = false;
      this.captchaFormGroup = this.createFormGroup(this.model)
      this.captchaFormGroup.markAsUntouched();
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
    })
  }

}
