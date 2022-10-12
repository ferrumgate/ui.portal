import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigEmail } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { ThemeSelectorComponent } from 'src/app/modules/shared/themeselector/themeselector.component';


interface Model extends ConfigEmail {
  isChanged: boolean
  orig: ConfigEmail
}






@Component({
  selector: 'app-config-email-external',
  templateUrl: './config-email-external.component.html',
  styleUrls: ['./config-email-external.component.scss']
})
export class ConfigEmailExternalComponent implements OnInit {




  isThemeDark = false;
  private _model: Model = {
    fromname: '', type: 'empty', pass: '', user: '',
    isChanged: false, orig: { fromname: '', type: 'empty', pass: '', user: '' }
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


  error: { user: string, pass: string } = { user: '', pass: '' };

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';


  }
  ngOnInit(): void {

  }


  ngAfterViewInit(): void {

  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        user: new FormControl(model.user, [Validators.required, InputService.emailValidator]),
        pass: new FormControl(model.pass, [Validators.required]),


      });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      fm.valueChanges.subscribe(x => {
        (this._model as any)[iterator] = x;
      })
    }
    fmg.valueChanges.subscribe(x => {
      this.modelChanged();
    })
    return fmg;
  }

  resetFormErrors() {

    return {
      user: '', pass: '', fromname: ''
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
    return { fromname: this.model.user, type: this.model.type, user: this.model.user, pass: this.model.user };
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
