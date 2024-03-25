import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigEmail } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

interface Model extends ConfigEmail {
  isChanged: boolean
  orig: ConfigEmail
}

@Component({
  selector: 'app-config-email-aws',
  templateUrl: './config-email-aws.component.html',
  styleUrls: ['./config-email-aws.component.scss']
})
export class ConfigEmailAWSComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();

  isThemeDark = false;
  private _model: Model = {
    fromname: '', type: 'empty', pass: '', user: '', region: '',
    isChanged: false, accessKey: '', secretKey: '',
    orig: {
      fromname: '', type: 'empty', pass: '',
      user: '', region: '', accessKey: '', secretKey: ''
    }
  };
  public get model() {
    return this._model;

  }
  @Input()
  public set model(val: ConfigEmail) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,

    }
    this.formGroup = this.createFormGroup(this._model);
  }

  @Output()
  public saveEmail: EventEmitter<ConfigEmail> = new EventEmitter();
  @Output()
  public deleteEmail: EventEmitter<void> = new EventEmitter();

  @Output()
  public checkEmail: EventEmitter<ConfigEmail> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this.model);

  error: { user: string, pass: string, accessKey: string, secretKey: string, region: string } = { user: '', pass: '', accessKey: '', secretKey: '', region: '' };

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
        user: new FormControl(model.user, [Validators.required, InputService.emailValidator]),
        region: new FormControl(model.region, [Validators.required]),
        accessKey: new FormControl(model.accessKey, [Validators.required]),
        secretKey: new FormControl(model.secretKey, [Validators.required]),

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
      user: '', pass: '', fromname: '', accessKey: '', secretKey: '', region: ''
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

    const userError = this.formGroup.controls['user'].errors;

    if (userError) {
      if (userError['required'])
        this.error.user = 'EmailRequired';
      else
        this.error.user = 'EmailRequired';
    }

    const regionError = this.formGroup.controls['region']?.errors;

    if (regionError) {
      if (regionError['required'])
        this.error.region = 'RegionRequired';
      else
        this.error.region = 'RegionRequired';
    }

    const accessKeyError = this.formGroup.controls['accessKey']?.errors;

    if (accessKeyError) {
      if (accessKeyError['required'])
        this.error.accessKey = 'AccessKeyRequired';
      else
        this.error.accessKey = 'AccessKeyRequired';
    }

    const secretKeyError = this.formGroup.controls['secretKey']?.errors;

    if (secretKeyError) {
      if (secretKeyError['required'])
        this.error.secretKey = 'SecretKeyRequired';
      else
        this.error.secretKey = 'SecretKeyRequired';
    }

  }

  checkIfModelChanged() {
    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (original.user != model.user)
      model.isChanged = true;
    if (original.pass != model.pass)
      model.isChanged = true;
    if (original.accessKey != model.accessKey)
      model.isChanged = true;
    if (original.secretKey != model.secretKey)
      model.isChanged = true;
    if (original.region != model.region)
      model.isChanged = true;

    if (original.fromname != model.fromname)
      model.isChanged = true;

  }

  clear() {
    const orig = this.model.orig;
    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;
    this.model.orig = orig;
    this.model.checkEmail = false;

  }
  createBaseModel(): ConfigEmail {
    return {
      fromname: this.model.user, type: this.model.type,
      user: this.model.user, pass: this.model.pass,
      accessKey: this.model.accessKey,
      secretKey: this.model.secretKey,
      region: this.model.region
    };
  }

  saveOrUpdate() {
    if (this.formGroup.valid) {
      //make it safe from too much properties
      this.saveEmail.emit(this.createBaseModel());
    }
  }

  delete() {
    if (this.formGroup.valid)
      this.deleteEmail.emit();
  }
  check() {

    if (this.formGroup.valid) {
      this.checkEmail.emit(this.createBaseModel());
    }

  }

  canSend() {
    return this.formGroup.valid;
  }
  canDelete() {
    if (this.formGroup.valid && !this.model.isChanged)
      return true;
    return false;
  }

}
