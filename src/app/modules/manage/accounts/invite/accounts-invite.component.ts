import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { InputService } from 'src/app/modules/shared/services/input.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import validator from 'validator';


interface BaseModel {
  emails: string;
  isChanged: boolean
}
interface Model extends BaseModel {


}

@Component({
  selector: 'app-accounts-invite',
  templateUrl: './accounts-invite.component.html',
  styleUrls: ['./accounts-invite.component.scss']
})
export class AccountsInviteComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';


  isThemeDark = false;
  private _model: Model = { emails: '', isChanged: false };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      ...val,
      isChanged: false,
    }

    this.inviteFormGroup = this.createFormGroup(this._model);
  }


  //es settings
  inviteFormGroup: FormGroup = this.createFormGroup(this.model);

  inviteError: { emails: string } = { emails: '' };
  viewInvite = true;
  results: { email: string, errMsg?: string }[] = [];
  constructor(private router: Router,
    private translateService: TranslationService,
    private configService: ConfigService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService,
    private userService: UserService) {


    this.allSub.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';
      })
    this.isThemeDark = this.configService.getTheme() == 'dark';



    this.helpLink = this.configService.links.accountInviteHelp;
    this.results.push({ email: 'test@abc.ocmo', errMsg: 'error sfasdfafawasdfaw adfasdfasdfa' });
    this.results.push({ email: 'test@ferrumgate.com', errMsg: '' });
  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
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
        emails: new FormControl(model.emails, [Validators.required]),

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
        this.inviteModelChanged();
      })
    return fmg;
  }
  resetInviteErrors() {

    return {
      emails: ''
    }
  }

  inviteModelChanged() {
    this.checkInviteFormError();
    if (this.inviteFormGroup.valid)
      this.checkIfModelChanged();
    else this._model.isChanged = false;

  }

  checkInviteFormError() {
    //check errors 
    this.inviteError = this.resetInviteErrors();
    const emailsError = this.inviteFormGroup.controls.emails.errors;

    if (emailsError) {
      if (emailsError['required'])
        this.inviteError.emails = 'EnterAtLeastOneEmail';
      else
        this.inviteError.emails = 'EnterAtLeastOneEmail';
    }


  }
  splitEmails(str: String) {
    return str.split(/[!\s,_+;:]+/).map(x => x.trim()).filter(y => y);
  }
  checkIfModelChanged() {

    let model = this.model as Model;
    model.isChanged = false;
    if (this.splitEmails(this.model.emails))
      this._model.isChanged = true;
    else this._model.isChanged = false;


  }

  clear() {

    this.model.isChanged = false;
    this.model.emails = '';
    this.inviteFormGroup = this.createFormGroup(this.model);
  }
  saveOrUpdate() {
    const emails = this.splitEmails(this.model.emails);
    if (!emails.length) {
      this.notificationService.error(this.translateService.translate("EnterAtLeastOneEmail"));
      return;
    }
    for (const email of emails) {
      const isValid = validator.isEmail(email);
      if (!isValid) {
        this.notificationService.error(email + ` ` + this.translateService.translate(`EmailIsInvalid`))
        return;
      }
    }
    this.confirmService.showAreYouSure().pipe(
      takeWhile(x => x),
      switchMap(y => {
        return this.userService.invite({ emails: emails });
      })
    ).subscribe(y => {
      this.viewInvite = false;
      this.results = y.results;
      this.notificationService.success(this.translateService.translate("SuccessfullyInvited"))
    })


  }
  back() {
    this.viewInvite = true;
  }


}