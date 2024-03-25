import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, map, of, switchMap, takeWhile } from 'rxjs';
import { ConfigCommon } from 'src/app/modules/shared/models/config';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

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
export class ConfigCommonComponent implements OnInit, OnDestroy, AfterViewInit {

  allSub = new SSubscription();

  isThemeDark = false;
  private _model: Model = { url: '', domain: '', httpsRedirect: false, isChanged: false, orig: { url: '', domain: '' } };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      url: val.url,
      domain: val.domain,
      httpsRedirect: val.httpsRedirect,
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
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService) {

    this.allSub.addThis =
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
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        domain: new FormControl(model.domain, [Validators.required, InputService.domainValidator]),
        url: new FormControl(model.url, [Validators.required, InputService.urlValidator]),
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
        this.commonModelChanged();
      })
    return fmg;
  }
  resetCommonErrors() {

    return {
      domain: '', url: ''
    }
  }

  commonModelChanged() {
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
    if (original.httpsRedirect != model.httpsRedirect)
      model.isChanged = true;

  }

  clear() {
    this.model.domain = (this.model as Model).orig.domain;
    this.model.url = (this.model as Model).orig.url;
    this.model.httpsRedirect = (this.model as Model).orig.httpsRedirect;
    this.model.isChanged = false;
  }

  saveOrUpdate() {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveCommonConfig(this.model))
    ).subscribe(y => {
      let refreshPage = false;
      if ((this.model as any).orig.httpsRedirect != this.model.httpsRedirect && this.model.httpsRedirect && location.protocol != 'https:') {

        refreshPage = true//we need to refresh page if https activated
      }

      (this.model as Model).orig = y;
      this.model.isChanged = false;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

      if (refreshPage) {//reload window

        of('').pipe(
          delay(2000),
          map(x => {
            window.location.reload();
          })
        ).subscribe();
      }

    })
  }

  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }

}
