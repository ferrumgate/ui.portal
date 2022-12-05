import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavMenuItem } from '../navmenu/navmenuitem';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { SSubscription } from '../services/SSubscribtion';
import { RBACDefault } from '../models/rbac';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],

})
export class ToolbarComponent implements OnInit {

  isMobile = false;
  isThemeDark = false;
  showLanguages = false;
  private allSubs = new SSubscription();
  view = {
    isAdmin: false,
    isReporter: false,
    map: { low: 'User', high: 'Admin' }
  }

  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private translator: TranslationService,) {

    this.showLanguages = this.translator.getAllLanguages().length > 1;
    this.allSubs.addThis =
      this.configService.themeChanged.subscribe(x => {
        this.isThemeDark = x == 'dark';

      })
    this.isThemeDark = this.configService.getTheme() == 'dark';

    this.allSubs.addThis =
      this.configService.viewChanged.subscribe(x => {
        if (x == 'low')
          this.router.navigate(['/dashboard']);
        else if (x == 'high')
          this.router.navigate(['/manage/dashboard'])

      })

  }
  ngOnInit(): void {
    this.view.isAdmin = false;
    this.view.isReporter = false;
    if (this.authService.currentSession?.currentUser?.roles?.find(x => x.name == RBACDefault.roleAdmin.name)) {
      this.view.isAdmin = true;
      this.view.map = { low: 'User', high: 'Admin' };
    }
    if (this.authService.currentSession?.currentUser?.roles?.find(x => x.name == RBACDefault.roleReporter.name)) {
      this.view.isReporter = true;
      this.view.map = { low: 'User', high: 'Reporter' };
    }

  }

  ngOnDestroy() {

    this.allSubs.unsubscribe();
  }

  @Output()
  menuClicked = new EventEmitter();


  logout() {
    this.authService.logout();
  }
  userSettings() {
    this.router.navigate(['/user/settings']);
  }

}
