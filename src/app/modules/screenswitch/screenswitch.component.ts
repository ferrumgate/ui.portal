import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RBACDefault } from '../shared/models/rbac';
import { AuthenticationService } from '../shared/services/authentication.service';
import { CaptchaService } from '../shared/services/captcha.service';
import { ConfigService } from '../shared/services/config.service';
import { NotificationService } from '../shared/services/notification.service';
import { TranslationService } from '../shared/services/translation.service';

@Component({
  selector: 'app-screenswitch',
  templateUrl: './screenswitch.component.html',
  styleUrls: ['./screenswitch.component.scss']
})
export class ScreenSwitchComponent implements OnInit {
  isThemeDark = false;

  isManaged = false;
  isUse = true;
  constructor(private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService,
    private translateService: TranslationService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private captchaService: CaptchaService) {

    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';
    })
    this.isThemeDark = this.configService.getTheme() == 'dark';

  }

  ngOnInit(): void {
    const isAdmin = this.authService.currentSession?.currentUser?.roles?.find(x => x.name == RBACDefault.roleAdmin.name);
    //const isReporter = this.authService.currentSession?.currentUser.roles.find(x => x.name == RBACDefault.roleReporter.name);
    //const isUser = this.authService.currentSession?.currentUser.roles.find(x => x.name == RBACDefault.roleUser.name);

    if (isAdmin && !this.configService.isAllReadyConfigured)
      this.router.navigate(['/configure']);
    else
      if (this.authService.currentSession?.createdWith.includes('exchangeKey')) {
        this.router.navigate(['/user/closewindow'])
      } else
        if (this.authService.currentSession?.currentUser?.roles?.find(x => x.name == RBACDefault.roleAdmin.name || x.name == RBACDefault.roleReporter.name)) {
          this.router.navigate(['/manage/dashboard'])
        } else {
          this.configService.saveView('low');
          this.router.navigate(['/user/dashboard'])
        }
  }

}
