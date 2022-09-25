import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavMenuItem } from '../../shared/navmenu/navmenuitem';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-manage-layout',
  templateUrl: './manage-layout.component.html',
  styleUrls: ['./manage-layout.component.scss'],

})
export class ManageLayoutComponent {


  isMobile = false;
  isThemeDark = false;
  showLanguages = false;
  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private translator: TranslationService,
    private captchaService: CaptchaService) {

    this.showLanguages = this.translator.getAllLanguages().length > 1;
    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';

  }

  isExpanded = false;
  @ViewChild('snav')
  nav!: MatSidenav;
  menuClicked(event: any) {
    this.nav.toggle();
  }
  menus: NavMenuItem[] = [
    {
      icon: 'dashboard', isClicked: false, isExpanded: false, name: this.translateService.translate('Dashboard'), subItems: [], navigate: () => { this.router.navigate(['/manage/dashboard']) }
    },
    {
      icon: 'lan', isClicked: false, isExpanded: false, name: this.translateService.translate('Network'), navigate: () => { this.router.navigate(['/manage/network']) }, subItems: []
    },
    {
      icon: 'supervisor_account', isClicked: false, isExpanded: false, name: this.translateService.translate('Accounts'), navigate: () => { },
      subItems: [
        {
          icon: 'person', isClicked: false, isExpanded: false, name: this.translateService.translate('Users'), subItems: [], navigate: () => { this.router.navigate(['/manage/account/users']) }
        },
        {
          icon: 'group', isClicked: false, isExpanded: false, name: this.translateService.translate('Groups'), subItems: [], navigate: () => { this.router.navigate(['/manage/account/groups']) }

        }]
    },
    {
      icon: 'swap_calls', isClicked: false, isExpanded: false, name: this.translateService.translate('Services'), subItems: [], navigate: () => { this.router.navigate(['/manage/services']) }
    },
    {
      icon: 'fact_check', isClicked: false, isExpanded: false, name: this.translateService.translate('Policies'), subItems: [], navigate: () => { this.router.navigate(['/manage/policies']) }
    },
    {
      icon: 'settings', isClicked: false, isExpanded: false, name: this.translateService.translate('Settings'), navigate: () => { },
      subItems: [
        {
          icon: 'settings_applications', isClicked: false, isExpanded: false, name: this.translateService.translate('Common'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/common']) }
        },
        {
          icon: 'recaptcha', isSVG: true, isClicked: false, isExpanded: false, name: this.translateService.translate('Captcha'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/captcha']) }
        },
        {
          icon: 'vpn_key', isClicked: false, isExpanded: false, name: this.translateService.translate('Auth'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/auth']) }
        },
        {
          icon: 'email', isClicked: false, isExpanded: false, name: this.translateService.translate('Email'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/email']) }
        }
      ],
    },
    {
      icon: 'receipt', isClicked: false, isExpanded: false, name: this.translateService.translate('Logs'),
      subItems: [
        {
          icon: 'screen_search_desktop', isClicked: false, isExpanded: false, name: this.translateService.translate('Audit'), subItems: [], navigate: () => { this.router.navigate(['/manage/logs/gateway']) }
        },
        {
          icon: 'computer', isClicked: false, isExpanded: false, name: this.translateService.translate('Gateway'), subItems: [], navigate: () => { this.router.navigate(['/manage/logs/gateway']) }
        }
      ], navigate: () => { }
    }
  ]

}
