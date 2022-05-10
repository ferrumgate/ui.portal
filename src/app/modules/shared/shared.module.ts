import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { translationHttpLoaderFactory, TranslationService } from "src/app/core/services/translation.service";
import { MaterialModule } from "./material-module";
import { ThemeSelectorComponent } from './themeselector/themeselector.component';
import { FooterComponent } from './footer/footer.component';
import { LanguageSelectorComponent } from "./languageselector/languageselector.component";
import { ConfigService } from "src/app/core/services/config.service";
import { AuthenticationService } from "src/app/core/services/authentication.service";
import { CommonModule } from "@angular/common";





@NgModule({
    exports: [
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        ThemeSelectorComponent,
        FooterComponent,
        LanguageSelectorComponent,


    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: translationHttpLoaderFactory,
                deps: [HttpClient]
            }
        })



    ],
    declarations: [
        ThemeSelectorComponent,
        FooterComponent,
        LanguageSelectorComponent
    ],
    providers: [

    ]

})
export class SharedModule { }