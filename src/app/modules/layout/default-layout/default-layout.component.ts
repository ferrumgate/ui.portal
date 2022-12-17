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

export interface NavMenuItemExtendedAuthSource extends NavMenuItem {
  authSourcePattern: string;
  subItems: NavMenuItemExtendedAuthSource[];

}

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],

})
export class DefaultLayoutComponent {


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
  menus: NavMenuItemExtendedAuthSource[] = [
    {
      icon: 'dashboard', authSourcePattern: '*', isClicked: false, isExpanded: false, name: this.translateService.translate('Dashboard'), subItems: [], navigate: () => { this.router.navigate(['/user/dashboard']) }
    },

    {
      icon: 'cloud_download', authSourcePattern: '*', isClicked: false, isExpanded: false, name: this.translateService.translate('Downloads'), subItems: [], navigate: () => { this.router.navigate(['/user/downloads']) }
    },

    {
      icon: 'settings', authSourcePattern: '*', isClicked: false, isExpanded: false, name: this.translateService.translate('Settings'), navigate: () => { },
      subItems: [
        {
          icon: 'phonelink_setup', authSourcePattern: '*', isClicked: false, isExpanded: false, name: this.translateService.translate('2FA'), subItems: [],
          navigate: () => {
            this.router.navigate(['/user/settings/2fa'])
          }
        },
        {
          icon: 'lock', authSourcePattern: 'local-local', isClicked: false, isExpanded: false, name: this.translateService.translate('Password'), subItems: [],
          navigate: () => {
            this.router.navigate(['/user/settings/password'])
          }
        }

      ]
    }
  ]

  selectedMenus: NavMenuItem[] = [];


  ngOnInit(): void {
    const authSource = this.authService.currentSession?.currentUser?.source;
    if (authSource) {

      this.selectedMenus = this.menus.filter(x => x.authSourcePattern == '*' || authSource.includes(x.authSourcePattern)).map(x => {
        const list = x.subItems.filter(y => y.authSourcePattern == '*' || authSource.includes(y.authSourcePattern))
        x.subItems = list;
        return x;
      })
    }

  }


}
