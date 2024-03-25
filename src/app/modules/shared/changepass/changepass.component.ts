import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SSubscription } from '../services/SSubscribtion';
import { ConfigService } from '../services/config.service';
import { InputService } from '../services/input.service';
import { TranslationService } from '../services/translation.service';

export interface ChangePass {
  oldPass: string;
  newPass: string;

}
export interface ChangePassExtended extends ChangePass {
  newPassAgain: string;
  isChanged: boolean;
}

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.scss']
})
export class ChangePassComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  hideOldPass = true;
  hidenewPass = true;

  _model: ChangePassExtended = { oldPass: '', newPass: '', newPassAgain: '', isChanged: false };

  @Input()
  set model(val: ChangePassExtended) {
    this._model = {
      ...val
    }
    this.formGroup = this.createFormGroup(this.model);
  }

  get model() {
    return this._model;
  }

  @Output()
  changePass: EventEmitter<ChangePass> = new EventEmitter();

  formGroup: FormGroup = this.createFormGroup(this.model);
  formError = this.createFormError();

  isThemeDark = false;
  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private translateService: TranslationService,
  ) {

    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.helpLink = this.configService.links.passwordHelp;
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }

  openHelp() {
    if (this.helpLink) {
      window.open(this.helpLink, '_blank');
    }
  }
  modelChanged() {

    this.checkFormError();
    if (this.formGroup.valid)
      this.checkIfModelChanged();
    else this.model.isChanged = false;

  }

  createFormGroup(model: ChangePassExtended) {
    const fmg = new FormGroup({
      oldPass: new FormControl(model.oldPass, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      newPass: new FormControl(model.newPass, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
      newPassAgain: new FormControl(model.newPassAgain, [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
    },
      {
        validators: Validators.compose([InputService.matchingPasswords('newPass', 'newPassAgain')])
      });

    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      this.allSub.addThis =
        fm.valueChanges.subscribe(x => {
          (this.model as any)[iterator] = x;
        })
    }
    this.allSub.addThis =
      fmg.valueChanges.subscribe(x => {
        this.modelChanged();
      })
    return fmg;
  }
  createFormError() {
    return { oldPass: '', newPass: '', newPassAgain: '', };
  }

  checkIfModelChanged() {
    this.model.isChanged = false;
    if (this.model.oldPass)
      this.model.isChanged = true;
    if (this.model.newPass)
      this.model.isChanged = true;
    if (this.model.newPassAgain)
      this.model.isChanged = true;

  }

  checkFormError() {
    //check errors 
    let error = this.createFormError();

    const oldPassError = this.formGroup.controls['oldPass'].errors;
    if (oldPassError) {

      if (oldPassError['required'])
        error.oldPass = 'PasswordRequired';
      else if (oldPassError['minlength'])
        error.oldPass = 'PasswordMinLength';
      else if (oldPassError['pattern'])
        error.oldPass = 'PasswordPattern';
      else if (oldPassError['mismatchedPasswords'])
        error.oldPass = 'PasswordsMismatch';
      else
        error.oldPass = 'PasswordInvalid';

    }

    const newPassError = this.formGroup.controls['newPass'].errors;
    if (newPassError) {

      if (newPassError['required'])
        error.newPass = 'PasswordRequired';
      else if (newPassError['minlength'])
        error.newPass = 'PasswordMinLength';
      else if (newPassError['pattern'])
        error.newPass = 'PasswordPattern';
      else if (newPassError['mismatchedPasswords'])
        error.newPass = 'PasswordsMismatch';
      else
        error.newPass = 'PasswordInvalid';

    }
    const newPassAgainError = this.formGroup.controls['newPassAgain'].errors;
    if (newPassAgainError) {

      if (newPassAgainError['required'])
        error.newPassAgain = 'PasswordAgainRequired';
      else if (newPassAgainError['minlength'])
        error.newPassAgain = 'PasswordAgainMinLength';
      else if (newPassAgainError['pattern'])
        error.newPassAgain = 'PasswordAgainPattern';
      else if (newPassAgainError['mismatchedPasswords'])
        error.newPassAgain = 'PasswordsMismatch';
      else
        error.newPassAgain = 'PasswordInvalid';

    }
    this.formError = error;
    (this.formGroup as FormGroup).markAllAsTouched();

  }

  clear() {
    this.model = {
      isChanged: false,
      newPass: '',
      newPassAgain: '',
      oldPass: ''
    }
    this.checkIfModelChanged();
  }
  createBaseModel(): ChangePass {
    return {
      oldPass: this.model.oldPass,
      newPass: this.model.newPass
    }
  }

  saveOrUpdate() {

    this.changePass.emit(this.createBaseModel());
  }

}
