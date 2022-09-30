import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UrlHandlingStrategy } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmComponent, ConfirmDialogModel } from '../confirm/confirm.component';
import { Configure } from '../models/configure';
import { Gateway } from '../models/network';
import { BaseService } from './base.service';
import { CaptchaService } from './captcha.service';
import { ConfigService } from './config.service';

import { TranslationService } from './translation.service';
import { UtilService } from './util.service';



@Injectable({
    providedIn: 'root'
})
export class ConfirmService {

    constructor(
        private configService: ConfigService,
        private translateService: TranslationService,
        private dialog: MatDialog) {

    }

    show(title: string, message: string, width = "400px") {

        const dialogData = new ConfirmDialogModel(title, message);

        const dialogRef = this.dialog.open(ConfirmComponent, {
            maxWidth: width,
            data: dialogData,
            panelClass: 'confirm-background',


        });
        return dialogRef.afterClosed();
    }

    showSave() {

        return this.show(
            this.translateService.translate('Confirm'),
            this.translateService.translate("DoYouWantToSave")
        )
    }

    showDelete() {

        return this.show(
            this.translateService.translate('Confirm'),
            this.translateService.translate("DoYouWantToDelete")
        )
    }

}
