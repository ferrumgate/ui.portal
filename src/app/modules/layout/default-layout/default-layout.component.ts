import { ChangeDetectorRef, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CaptchaService } from 'src/app/core/services/captcha.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavMenuItem } from '../../shared/navmenu/navmenuitem';

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
  menus: NavMenuItem[] = [
    {
      icon: 'dashboard', isClicked: false, isExpanded: false, name: 'Dashboard', subItems: [], navigate: () => { this.router.navigate(['/dashboard']) }
    },
    {
      icon: 'settings', isClicked: false, isExpanded: false, name: 'Settings',
      subItems: [
        {
          icon: 'folder', isClicked: false, isExpanded: false, name: 'Something', subItems: [], navigate: () => { }
        },
        {
          icon: 'folder', isClicked: false, isExpanded: false, name: 'Something2', subItems: [], navigate: () => { }
        }
      ], navigate: () => { this.router.navigate(['/dashboard']) }
    }
  ]

}
