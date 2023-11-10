import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { translationHttpLoaderFactory, TranslationService } from "src/app/modules/shared/services/translation.service";
import { MaterialModule } from "./material-module";
import { ThemeSelectorComponent } from './themeselector/themeselector.component';
import { FooterComponent } from './footer/footer.component';
import { LanguageSelectorComponent } from "./languageselector/languageselector.component";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from './loading/loading.component';
import { RecaptchaV3Module, ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import { ReCaptchaV3ServiceCustom } from "src/app/modules/shared/services/captcha.service";
import { QRCodeModule } from 'angularx-qrcode';
import { NavMenuComponent } from './navmenu/navmenu.component';
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { NetworkComponent } from './network/network.component';
import { GatewayComponent } from "./gateway/gateway.component";
import { ConfirmComponent } from "./confirm/confirm.component";
import { AuthLdapComponent } from './auth/auth-ldap/auth-ldap.component';
import { AuthSamlComponent } from './auth/auth-saml/auth-saml.component';
import { AuthOauthComponent } from './auth/auth-oauth/auth-oauth.component';
import { AuthLocalComponent } from './auth/auth-local/auth-local.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from "./group/group.component";
import { ServiceComponent } from "./service/service.component";
import { PolicyAuthzRuleComponent } from "./policy/policy-authz-rule/policy-authz-rule.component";
import { PolicyAuthnRuleComponent } from "./policy/policy-authn-rule/policy-authn-rule.component";
import { DashboardStatusComponent } from "./dashboard/status/dashboard-status.component";
import { DashboardChartComponent } from "./dashboard/chart/dashboard-chart.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { ViewSelectorComponent } from "./viewselector/viewselector.component";
import { T2FAComponent } from "./t2fa/t2fa.component";
import { ChangePassComponent } from "./changepass/changepass.component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { FileUploadComponent } from "./fileupload/fileupload.component";
import { PolicyAuthnRuleTimeAddComponent } from "./policy/policy-authn-rule/policy-authn-rule-time-add/policy-authn-rule-time-add.component";
import { DevicePostureComponent } from "./deviceposture/deviceposture.component";
import { PolicyAuthzRuleFqdnComponent } from "./policy/policy-authz-rule/policy-authz-rule-fqdn/policy-authz-rule-fqdn.component";
import { AuthOpenIdComponent } from "./auth/auth-openid/auth-openid.component";
import { AuthRadiusComponent } from "./auth/auth-radius/auth-radius.component";
import { DnsRecordComponent } from "./dns/dns-record.component";




@NgModule({
    exports: [
        MaterialModule,
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RecaptchaV3Module,
        ClipboardModule,
        NgApexchartsModule,
        ThemeSelectorComponent,
        ViewSelectorComponent,
        FooterComponent,
        LanguageSelectorComponent,
        LoadingComponent,
        QRCodeModule,
        NavMenuComponent,
        ToolbarComponent,
        NetworkComponent,
        GatewayComponent,
        ConfirmComponent,
        AuthOauthComponent,
        AuthLdapComponent,
        AuthLocalComponent,
        AuthSamlComponent,
        AuthOpenIdComponent,
        AuthRadiusComponent,
        GroupComponent,
        UserComponent,
        ServiceComponent,
        PolicyAuthzRuleComponent,
        PolicyAuthnRuleComponent,
        DashboardStatusComponent,
        DashboardChartComponent,
        T2FAComponent,
        ChangePassComponent,
        FileUploadComponent,
        DevicePostureComponent,
        DnsRecordComponent

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
        QRCodeModule,
        NgApexchartsModule




    ],
    declarations: [
        ThemeSelectorComponent,
        ViewSelectorComponent,
        FooterComponent,
        LanguageSelectorComponent,
        LoadingComponent,
        NavMenuComponent,
        ToolbarComponent,
        NetworkComponent,
        GatewayComponent,
        ConfirmComponent,
        AuthLdapComponent,
        AuthSamlComponent,
        AuthOauthComponent,
        AuthLocalComponent,
        AuthOpenIdComponent,
        AuthRadiusComponent,
        GroupComponent,
        UserComponent,
        ServiceComponent,
        PolicyAuthzRuleComponent,
        PolicyAuthnRuleComponent,
        PolicyAuthnRuleTimeAddComponent,
        PolicyAuthzRuleFqdnComponent,
        DashboardStatusComponent,
        DashboardChartComponent,
        T2FAComponent,
        ChangePassComponent,
        FileUploadComponent,
        DevicePostureComponent,
        DnsRecordComponent
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