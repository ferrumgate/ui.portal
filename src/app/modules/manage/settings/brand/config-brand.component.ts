import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs';
import { FileUploadComponent } from 'src/app/modules/shared/fileupload/fileupload.component';
import { ConfigBrand } from 'src/app/modules/shared/models/config';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { ConfirmService } from 'src/app/modules/shared/services/confirm.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { SSubscription } from 'src/app/modules/shared/services/SSubscribtion';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

interface BaseModel extends ConfigBrand {
  isChanged: boolean,
  logoWhiteFileName: string;
  logoBlackFileName: string;
}
interface Model extends BaseModel {
  orig: ConfigBrand
}

@Component({
  selector: 'app-config-brand',
  templateUrl: './config-brand.component.html',
  styleUrls: ['./config-brand.component.scss']
})
export class ConfigBrandComponent implements OnInit, OnDestroy {
  allSub = new SSubscription();
  helpLink = '';

  @ViewChild('fileuploadWhite') fileUploadWhite!: FileUploadComponent
  @ViewChild('fileuploadBlack') fileUploadBlack!: FileUploadComponent
  isThemeDark = false;
  private _model: Model = {
    name: '', logoWhite: '', logoBlack: '', logoBlackFileName: 'SelectAFileToUpload',
    logoWhiteFileName: 'SelectAFileToUpload',
    isChanged: false, orig: { name: '', logoWhite: '', logoBlack: '', }
  };
  public get model() {
    return this._model;

  }
  public set model(val: BaseModel) {
    this._model = {
      ...val,
      isChanged: false,
      orig: val,
      logoBlackFileName: this.calculateFilenameBlack(val),
      logoWhiteFileName: this.calculateFilenameWhite(val)
    }

    this.formGroup = this.createFormGroup(this._model);
  }

  //settings
  formGroup: FormGroup = this.createFormGroup(this.model);

  error: { name: string, logoWhite: string, logoBlack: string } = { name: '', logoWhite: '', logoBlack: '' };

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

    this.helpLink = this.configService.links.brandHelp;

  }

  openHelp() {
    if (this.helpLink)
      window.open(this.helpLink, '_blank');
  }

  ngOnInit(): void {
    this.configService.getBrand().pipe().subscribe(x => {
      this.model = { ...x, isChanged: false, logoBlackFileName: this.calculateFilenameBlack(x), logoWhiteFileName: this.calculateFilenameWhite(x) };
    })

  }
  calculateFilenameBlack(x: ConfigBrand) {
    if (x.logoBlack)
      return "BlackLogo";
    return "SelectABlackLogoToUpload"
  }
  calculateFilenameWhite(x: ConfigBrand) {
    if (x.logoWhite)
      return "WhiteLogo";
    return "SelectAWhiteLogoToUpload"
  }

  ngOnDestroy(): void {
    this.allSub.unsubscribe();
  }
  ngAfterViewInit(): void {

  }

  createFormGroup(model: any) {
    const fmg = new FormGroup(
      {
        name: new FormControl(model.name, []),

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
  resetErrors() {

    return {
      name: '', logoBlack: '', logoWhite: ''
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
    this.error = this.resetErrors();

  }

  checkIfModelChanged() {

    let model = this.model as Model;
    model.isChanged = false;
    const original = model.orig;
    if (UtilService.checkUndefinedString(original.name, model.name))
      model.isChanged = true;
    if (UtilService.checkUndefinedString(original.logoBlack, model.logoBlack))
      model.isChanged = true;
    if (UtilService.checkUndefinedString(original.logoWhite, model.logoWhite))
      model.isChanged = true;

  }

  clear() {
    this.model.name = (this.model as Model).orig.name;
    this.model.logoWhite = (this.model as Model).orig.logoWhite;
    this.model.logoBlack = (this.model as Model).orig.logoBlack;
    this.model.logoBlackFileName = this.calculateFilenameBlack(this.model);
    this.model.logoWhiteFileName = this.calculateFilenameWhite(this.model);

    this.fileUploadBlack.reset();
    this.fileUploadWhite.reset();
    this.model.isChanged = false;

    this.formGroup = this.createFormGroup(this.model);
  }

  saveOrUpdate() {
    this.confirmService.showSave().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveBrand(this.model))
    ).subscribe(y => {
      (this.model as Model).orig = y;
      this.model.isChanged = false;
      this.notificationService.success(this.translateService.translate('SuccessfullySaved'));

    })
  }

  canDelete() {
    if (this.formGroup.valid && !this.model.isChanged && (this.model.name || this.model.logoBlack || this.model.logoWhite))
      return true;
    return false;
  }

  delete() {
    this.confirmService.showDelete().pipe(
      takeWhile(x => x),
      switchMap(y => this.configService.saveBrand({ name: '', logoBlack: '', logoWhite: '' }))
    ).subscribe(y => {
      this.model.name = y.name;
      this.model.logoBlack = y.logoBlack;
      this.model.logoWhite = y.logoWhite;

      (this.model as Model).orig = y;
      this.model.isChanged = false;

      this.formGroup = this.createFormGroup(this.model);
      this.formGroup.markAsUntouched();
      this.notificationService.success(this.translateService.translate('SuccessfullyDeleted'));

    })
  }

  validImageFiles = ['image/png', 'image/jpg', 'image/svg', 'image/jpeg', 'image/svg+xml']

  @Input()
  uploadProgressLogoWhite = 0;

  restoreLogoWhite(file: File) {
    console.log(file);
    if (!this.validImageFiles.includes(file.type)) {
      this.notificationService.error(this.translateService.translate("PleaseSelectAnImageFile"))
      this.error.logoWhite = "PleaseSelectAnImageFile";
      return;
    }
    const reader = new FileReader();
    console.log(file);
    reader.onload = (x: any) => {

      this.model.logoWhite = x?.target?.result;
      this.model.logoWhiteFileName = file.name;
      this.modelChanged();
    }
    reader.readAsDataURL(file);

  }
  deleteLogoWhite(ev: any) {

    this.model.logoWhite = '';
    this.model.logoWhiteFileName = this.calculateFilenameWhite(this.model);

    this.modelChanged();
  }

  @Input()
  uploadProgressLogoBlack = 0;

  restoreLogoBlack(file: File) {

    if (!this.validImageFiles.includes(file.type)) {
      this.notificationService.error(this.translateService.translate("PleaseSelectAnImageFile"))
      this.error.logoBlack = "PleaseSelectAnImageFile";
      return;
    }
    const reader = new FileReader();
    console.log(file);
    reader.onload = (x: any) => {

      this.model.logoBlack = x?.target?.result;
      this.model.logoBlackFileName = file.name;
      this.modelChanged();
    }
    reader.readAsDataURL(file);

  }
  deleteLogoBlack(ev: any) {

    this.model.logoBlack = '';
    this.model.logoBlackFileName = this.calculateFilenameBlack(this.model);

    this.modelChanged();
  }

}
