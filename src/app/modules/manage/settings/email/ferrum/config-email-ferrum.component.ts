import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigEmail } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

interface FerrumModel extends ConfigEmail {
  url: string;
}
interface Model extends FerrumModel {
  isChanged: boolean;
  orig: ConfigEmail
}

@Component({
  selector: 'app-config-email-ferrum',
  templateUrl: './config-email-ferrum.component.html',
  styleUrls: ['./config-email-ferrum.component.scss']
})
export class ConfigEmailFerrumComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();

  isThemeDark = false;
  private _model: Model = {
    fromname: '', type: 'empty', pass: '', user: '',
    url: '',
    isChanged: false, orig: {
      fromname: '', type: 'empty',
      pass: '', user: '', url: ''
    }
  };
  public get model() {
    return this._model;

  }
  @Input()
  public set model(val: ConfigEmail) {
    this._model = {
      ...val as FerrumModel,
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

  error: { user: string, pass: string, url: string } = {
    user: '', pass: '', url: ''
  };

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
        user: new FormControl(model.user, []),
        pass: new FormControl(model.pass, []),
        url: new FormControl(model.url, [Validators.required]),
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
      user: '', pass: '', fromname: '', url: ''
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
        this.error.user = 'UserRequired';
      else
        this.error.user = 'UserRequired';
    }

    const passError = this.formGroup.controls['pass'].errors;

    if (passError) {
      if (passError['required'])
        this.error.pass = 'PasswordRequired';
      else
        this.error.pass = 'PasswordRequired';
    }

    const urlError = this.formGroup.controls['url'].errors;

    if (urlError) {
      if (urlError['required'])
        this.error.url = 'UrlRequired';
      else
        this.error.url = 'UrlRequired';
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

    if (original.fromname != model.fromname)
      model.isChanged = true;

    if (original.url != model.url)
      model.isChanged = true;


  }

  clear() {
    const orig = this.model.orig;
    this.model = {
      ...this.model.orig
    }
    this.model.isChanged = false;
    this.model.orig = orig;

  }

  createBaseModel(): FerrumModel {
    return {
      fromname: this.model.user,
      type: this.model.type,
      user: this.model.user,
      pass: this.model.pass,
      url: this.model.url
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
    if (this.formGroup.valid && !this.model.isChanged && (this.model.pass || this.model.user))
      return true;
    return false;
  }

}
