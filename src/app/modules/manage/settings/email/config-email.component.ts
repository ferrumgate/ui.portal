import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, map, of, switchMap, takeWhile } from 'rxjs';
import { ConfigEmail } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';


interface BaseModel extends ConfigEmail {
  isChanged: boolean
}
interface Model extends BaseModel {


  orig: ConfigEmail
}
interface GoogleModel extends Model {

}
interface Office365Model extends Model {

}
interface SmtpModel extends Model {
  host: string,
  port: number,
  isSecure: boolean
}


@Component({
  selector: 'app-config-email',
  templateUrl: './config-email.component.html',
  styleUrls: ['./config-email.component.scss']
})
export class ConfigEmailComponent implements OnInit {


  helpLink = '';

  emailProviders = ['google', 'office365', 'smtp'];
  isThemeDark = false;
  private _model: Model = { fromname: '', type: 'empty', pass: '', user: '', isChanged: false, orig: { fromname: '', type: 'empty', pass: '', user: '' } };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val
    }
    this.formGroup = this.createFormGroup(this.model);

  }
  error = { type: '' };
  formGroup = this.createFormGroup(this.model);
  emailTypeFormControl = new FormControl();

  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';



    this.helpLink = this.configService.links.emailHelp;

  }
  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        type: new FormControl(model.type, [Validators.required]),
      });
    let keys = Object.keys(fmg.controls)
    for (const iterator of keys) {

      const fm = fmg.controls[iterator] as FormControl;
      fm.valueChanges.subscribe(x => {
        (this._model as any)[iterator] = x;
      })
    }
    fmg.valueChanges.subscribe(x => {
      //this.modelChanged();
    })
    return fmg;
  }

  resetFormErrors() {

    return {
      type: ''
    }
  }
  checkFormError() {
    //check errors 
    this.error = this.resetFormErrors();


    const userError = this.formGroup.controls['user'].errors;

    if (userError) {
      if (userError['required'])
        this.error.type = 'TypeRequired';
      else
        this.error.type = 'TypeRequired';
    }

  }
  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {
    this.configService.getEmailSettings().subscribe(x => {
      this.model = { ...x, isChanged: false };
      if (!this.model.type)
        this.model.type = 'google';
    })

  }
  ngAfterViewInit(): void {

  }


  checkEmail($event: ConfigEmail) {
    this.confirmService.show(
      this.translateService.translate('Confirm'),
      this.translateService.translate("DoYouWantSendEmail")
    ).pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.checkEmailSettings($event))
    ).subscribe(y => {
      if (!y.isError) {
        this.notificationService.success(this.translateService.translate('EmailSendedSuccessfullyPleaseCheckYourEmail'))
      }
      else {
        this.notificationService.error(this.translateService.translate('CouldNotSendEmail'));
        this.notificationService.error(this.translateService.translate(y.errorMessage));
      }
    })
  }

  deleteEmail() {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.deleteEmailSettings())
    ).subscribe(y => {
      this.model = { fromname: '', isChanged: false, pass: '', type: 'empty', user: '' }

      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));
    })
  }

  saveEmail($event: ConfigEmail) {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveEmailSettings($event))
    ).subscribe(y => {
      this.model = { ...y, isChanged: false };
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));
    })
  }





}
