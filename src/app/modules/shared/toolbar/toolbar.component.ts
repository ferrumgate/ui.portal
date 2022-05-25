import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavMenuItem } from '../navmenu/navmenuitem';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],

})
export class ToolbarComponent {

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
    private translator: TranslationService,) {

    this.showLanguages = this.translator.getAllLanguages().length > 1;
    this.configService.themeChanged.subscribe(x => {
      this.isThemeDark = x == 'dark';

    })
    this.isThemeDark = this.configService.getTheme() == 'dark';

  }

  @Output()
  menuClicked = new EventEmitter();




}
