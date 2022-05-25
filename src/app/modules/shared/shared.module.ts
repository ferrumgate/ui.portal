import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { translationHttpLoaderFactory, TranslationService } from "src/app/core/services/translation.service";
import { MaterialModule } from "./material-module";
import { ThemeSelectorComponent } from './themeselector/themeselector.component';
import { FooterComponent } from './footer/footer.component';
import { LanguageSelectorComponent } from "./languageselector/languageselector.component";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from './loading/loading.component';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import { ReCaptchaV3ServiceCustom } from "src/app/core/services/captcha.service";
import { QRCodeModule } from 'angularx-qrcode';
import { NavMenuComponent } from './navmenu/navmenu.component';






@NgModule({
    exports: [
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RecaptchaV3Module,
        ThemeSelectorComponent,
        FooterComponent,
        LanguageSelectorComponent,
        LoadingComponent,
        QRCodeModule,
        NavMenuComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        RecaptchaV3Module,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: translationHttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        QRCodeModule




    ],
    declarations: [
        ThemeSelectorComponent,
        FooterComponent,
        LanguageSelectorComponent,
        LoadingComponent,
        NavMenuComponent
    ],
    providers: [
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: 'some',

        },
        ReCaptchaV3Service,
    ]

})
export class SharedModule { }