import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { RBACDefault } from '../../shared/models/rbac';


export interface NavMenuItemRoleBased extends NavMenuItem {
  roleIds: string[];
  subItems: NavMenuItemRoleBased[];
}

@Component({
  selector: 'app-manage-layout',
  templateUrl: './manage-layout.component.html',
  styleUrls: ['./manage-layout.component.scss'],

})
export class ManageLayoutComponent implements OnInit {


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
  menus: NavMenuItemRoleBased[] = [
    {
      icon: 'dashboard', roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Dashboard'), subItems: [], navigate: () => { this.router.navigate(['/manage/dashboard']) }
    },
    {
      icon: 'panorama', roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Insights'), navigate: () => { },
      subItems: [
        {
          icon: 'scatter_plot', roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Activity'), subItems: [], navigate: () => { this.router.navigate(['/manage/insights/activity']) }
        }
      ]
    },
    {
      icon: 'lan', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Networks'), navigate: () => { this.router.navigate(['/manage/networks']) }, subItems: []
    },
    {
      icon: 'supervisor_account', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Accounts'), navigate: () => { },
      subItems: [
        {
          icon: 'person', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Users'), subItems: [], navigate: () => { this.router.navigate(['/manage/accounts/users']) }
        },
        {
          icon: 'group', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Groups'), subItems: [], navigate: () => { this.router.navigate(['/manage/accounts/groups']) }

        },
        {
          icon: 'insert_link', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Invite'), subItems: [], navigate: () => { this.router.navigate(['/manage/accounts/invite']) }

        }
      ]
    },
    {
      icon: 'services', roleIds: [RBACDefault.roleAdmin.id], isSVG: true, isClicked: false, isExpanded: false, name: this.translateService.translate('Services'), subItems: [], navigate: () => { this.router.navigate(['/manage/services']) }
    },
    {
      icon: 'fact_check', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Policies'), navigate: () => { },
      subItems: [
        {
          icon: 'how_to_reg', roleIds: [RBACDefault.roleAdmin.id], isSVG: false, isClicked: false, isExpanded: false, name: this.translateService.translate('Authentication'), subItems: [], navigate: () => { this.router.navigate(['/manage/policies/authn']) }
        },
        {
          icon: 'verified_user', roleIds: [RBACDefault.roleAdmin.id], isSVG: false, isClicked: false, isExpanded: false, name: this.translateService.translate('Authorization'), subItems: [], navigate: () => { this.router.navigate(['/manage/policies/authz']) }

        },
      ]
    },
    {
      icon: 'settings', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Settings'), navigate: () => { },
      subItems: [
        {
          icon: 'settings_applications', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Common'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/common']) }
        },
        {
          icon: 'recaptcha', roleIds: [RBACDefault.roleAdmin.id], isSVG: true, isClicked: false, isExpanded: false, name: this.translateService.translate('Captcha'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/captcha']) }
        },
        {
          icon: 'email', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Email'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/email']) }
        },
        {
          icon: 'vpn_key', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Auth'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/auth']) }
        },
        {
          icon: 'elasticsearch', roleIds: [RBACDefault.roleAdmin.id], isSVG: true, isClicked: false, isExpanded: false, name: this.translateService.translate('ES'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/es']) }
        },
        {
          icon: 'cloud_download', roleIds: [RBACDefault.roleAdmin.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Backup'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/backup']) }
        },
        {
          icon: 'ip-address', roleIds: [RBACDefault.roleAdmin.id], isSVG: true, isClicked: false, isExpanded: false, name: this.translateService.translate('IpIntelligence'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/ip/intelligence']) }
        },
        {
          icon: 'pki', roleIds: [RBACDefault.roleAdmin.id], isSVG: true, isClicked: false, isExpanded: false, name: this.translateService.translate('PKI'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/pki']) }
        },
        {
          icon: 'devices', roleIds: [RBACDefault.roleAdmin.id], isSVG: false, isClicked: false, isExpanded: false, name: this.translateService.translate('DevicePosture'), subItems: [], navigate: () => { this.router.navigate(['/manage/settings/device/posture']) }
        }
      ],
    },
    {
      icon: 'receipt', roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Logs'),
      subItems: [
        {
          icon: 'screen_search_desktop', roleIds: [RBACDefault.roleAdmin.id, RBACDefault.roleReporter.id], isClicked: false, isExpanded: false, name: this.translateService.translate('Audit'), subItems: [], navigate: () => { this.router.navigate(['/manage/logs/audit']) }
        },

      ], navigate: () => { }
    }
  ]

  selectedMenus: NavMenuItem[] = [];
  ngOnInit(): void {

    //
    if (this.authService.currentSession?.currentUser?.roles?.find(x => x.name == RBACDefault.roleAdmin.name)) {
      this.selectedMenus = this.menus.filter(x => x.roleIds.includes(RBACDefault.roleAdmin.id)).map(x => {
        x.subItems = x.subItems.filter(y => y.roleIds.includes(RBACDefault.roleAdmin.id))
        return x;
      })
    } else
      if (this.authService.currentSession?.currentUser?.roles?.find(x => x.name == RBACDefault.roleReporter.name)) {
        this.selectedMenus = this.menus.filter(x => x.roleIds.includes(RBACDefault.roleReporter.id)).map(x => {
          x.subItems = x.subItems.filter(y => y.roleIds.includes(RBACDefault.roleReporter.id))
          return x;
        })
      }
  }


}
