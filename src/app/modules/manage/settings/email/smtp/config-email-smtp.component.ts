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
import { ThemeSelectorComponent } from 'src/app/modules/shared/themeselector/themeselector.component';




interface SmtpModel extends ConfigEmail {
  host: string;
  port: number;
  isSecure: boolean;
}
interface Model extends SmtpModel {
  isChanged: boolean;
  orig: ConfigEmail
}






@Component({
  selector: 'app-config-email-smtp',
  templateUrl: './config-email-smtp.component.html',
  styleUrls: ['./config-email-smtp.component.scss']
})
export class ConfigEmailSmtpComponent implements OnInit, OnDestroy {

  allSub = new SSubscription();


  isThemeDark = false;
  private _model: Model = {
    fromname: '', type: 'empty', pass: '', user: '',
    host: 'localhost', port: 587, isSecure: true,
    isChanged: false, orig: { fromname: '', type: 'empty', pass: '', user: '', host: '', port: 587, isSecure: true }
  };
  public get model() {
    return this._model;

  }
  @Input()
  public set model(val: ConfigEmail) {
    this._model = {
      ...val as SmtpModel,
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


  error: { user: string, pass: string, host: string, port: string } = {
    user: '', pass: '', host: '', port: ''
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
        host: new FormControl(model.host, [Validators.required]),
        port: new FormControl(model.port, [Validators.required])
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
      user: '', pass: '', fromname: '', host: '', port: ''
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

    const passError = this.formGroup.controls['pass'].errors;

    if (passError) {
      if (passError['required'])
        this.error.pass = 'PasswordRequired';
      else
        this.error.pass = 'PasswordRequired';
    }

    const hostError = this.formGroup.controls['host'].errors;

    if (hostError) {
      if (hostError['required'])
        this.error.host = 'HostRequired';
      else
        this.error.pass = 'PasswordRequired';
    }

    const portError = this.formGroup.controls['port'].errors;

    if (portError) {
      if (portError['required'])
        this.error.port = 'PortRequired';
      else
        this.error.port = 'PortRequired';
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

    if (original.host != model.host)
      model.isChanged = true;
    if (original.port != model.port)
      model.isChanged = true;
    if (Boolean(original.isSecure) != model.isSecure)
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

  createBaseModel(): SmtpModel {
    return {
      fromname: this.model.user,
      type: this.model.type,
      user: this.model.user,
      pass: this.model.pass,
      host: this.model.host,
      port: this.model.port,
      isSecure: this.model.isSecure,

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
