import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent, ConfirmDialogModel } from '../confirm/confirm.component';
import { ConfigService } from './config.service';
import { TranslationService } from './translation.service';

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {

    constructor(
        private configService: ConfigService,
        private translateService: TranslationService,
        private dialog: MatDialog) {

    }

    show(title: string, message: string, width = "300px") {

        const dialogData = new ConfirmDialogModel(title, message);

        const dialogRef = this.dialog.open(ConfirmComponent, {

            width: width,
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
    showAreYouSure() {

        return this.show(
            this.translateService.translate('Confirm'),
            this.translateService.translate("AreYouSure")
        )
    }

}
