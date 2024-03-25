import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { QRCodeModule } from 'angularx-qrcode';
import { NgApexchartsModule } from "ng-apexcharts";
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from "ng-recaptcha";
import { translationHttpLoaderFactory } from "src/app/modules/shared/services/translation.service";
import { AuthLdapComponent } from './auth/auth-ldap/auth-ldap.component';
import { AuthLocalComponent } from './auth/auth-local/auth-local.component';
import { AuthOauthComponent } from './auth/auth-oauth/auth-oauth.component';
import { AuthOpenIdComponent } from "./auth/auth-openid/auth-openid.component";
import { AuthRadiusComponent } from "./auth/auth-radius/auth-radius.component";
import { AuthSamlComponent } from './auth/auth-saml/auth-saml.component';
import { ChangePassComponent } from "./changepass/changepass.component";
import { ConfirmComponent } from "./confirm/confirm.component";
import { DashboardChartComponent } from "./dashboard/chart/dashboard-chart.component";
import { DashboardStatusComponent } from "./dashboard/status/dashboard-status.component";
import { DevicePostureComponent } from "./deviceposture/deviceposture.component";
import { DnsRecordComponent } from "./dns/dns-record.component";
import { FileUploadComponent } from "./fileupload/fileupload.component";
import { FooterComponent } from './footer/footer.component';
import { GatewayComponent } from "./gateway/gateway.component";
import { GroupComponent } from "./group/group.component";
import { LanguageSelectorComponent } from "./languageselector/languageselector.component";
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from "./material-module";
import { NavMenuComponent } from './navmenu/navmenu.component';
import { NetworkComponent } from './network/network.component';
import { PolicyAuthnRuleTimeAddComponent } from "./policy/policy-authn-rule/policy-authn-rule-time-add/policy-authn-rule-time-add.component";
import { PolicyAuthnRuleComponent } from "./policy/policy-authn-rule/policy-authn-rule.component";
import { PolicyAuthzRuleFqdnComponent } from "./policy/policy-authz-rule/policy-authz-rule-fqdn/policy-authz-rule-fqdn.component";
import { PolicyAuthzRuleComponent } from "./policy/policy-authz-rule/policy-authz-rule.component";
import { ServiceComponent } from "./service/service.component";
import { T2FAComponent } from "./t2fa/t2fa.component";
import { ThemeSelectorComponent } from './themeselector/themeselector.component';
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { UProfileComponent } from "./uprofile/uprofile.component";
import { UserComponent } from './user/user.component';
import { ViewSelectorComponent } from "./viewselector/viewselector.component";

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
        DnsRecordComponent,
        UProfileComponent

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
        DnsRecordComponent,
        UProfileComponent
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