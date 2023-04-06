import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigEmail, ConfigES } from 'src/app/modules/shared/models/config';
import { IpIntelligenceSource } from 'src/app/modules/shared/models/ipIntelligence';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { IpIntelligenceService } from 'src/app/modules/shared/services/ipIntelligence.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';


interface BaseModel extends IpIntelligenceSource {
  apiKey?: string;

}
interface Model extends BaseModel {

  isChanged: boolean
  orig: IpIntelligenceSource
}

interface SmtpModel extends Model {
  host: string,
  port: number,
  isSecure: boolean
}

@Component({
  selector: 'app-config-ip-intelligence-source',
  templateUrl: './config-ip-intelligence-source.component.html',
  styleUrls: ['./config-ip-intelligence-source.component.scss']
})
export class ConfigIpIntelligenceSourceComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();

  @Input()
  helpLink = '';
  @Output()
  save = new EventEmitter();
  @Output()
  delete = new EventEmitter();
  @Output()
  check = new EventEmitter();

  apiProviders = ['ipdata.co', 'ipapi.com', 'ipify.org'];
  isThemeDark = false;
  private _model: Model = {
    id: '', insertDate: '', updateDate: '', apiKey: '',
    type: '', name: 'not set yet', isChanged: false,
    orig: {
      type: 'empty', name: 'not set yet', id: '',
      insertDate: '', updateDate: '', apiKey: ''
    }
  };

  public get model() {
    return this._model;

  }
  @Input()
  public set model(val: BaseModel) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val
    }
    this.formGroup = this.createFormGroup(this.model);

  }
  error = { type: '', apiKey: '' };
  formGroup = this.createFormGroup(this.model);


  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    private ipIntelligence: IpIntelligenceService) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';



    this.helpLink = this.configService.links.ipIntelligenceHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {


  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        apiKey: new FormControl(model.apiKey, [Validators.required]),
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
        this.modelChanged();
      })
    return fmg;
  }

  resetFormErrors() {

    return {
      type: '', apiKey: ''
    }
  }
  modelChanged() {
    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }
  checkFormError() {
    //check errors 
    this.error = this.resetFormErrors();

    const apiKeyError = this.formGroup.controls['apiKey'].errors;

    if (apiKeyError) {
      if (apiKeyError['required'])
        this.error.type = 'ApiKeyRequired';
      else
        this.error.type = 'ApiKeyRequired';
    }

  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.type != model.type)
      model.isChanged = true;
    if (original.apiKey != model.apiKey)
      model.isChanged = true;

  }


  apiTypeChanged($event: any) {

    this.model.type = $event.option.value;
  }


  checkSource() {

    this.check.emit(this.model);
  }

  deleteSource() {
    this.delete.emit(this.model);
  }

  saveSource() {

    this.save.emit(this.model);
  }

  canDelete() {
    if (this.formGroup.valid && !this.model.isChanged)
      return true;
    return false;
  }
  canCheck() {
    return this.formGroup.valid;
  }
  clear() {
    this.model = {
      ...this._model,
      apiKey: ''
    }
  }



}
