import { BreakpointObserver } from '@angular/cdk/layout';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/shared/services/authentication.service';
import { CaptchaService } from 'src/app/modules/shared/services/captcha.service';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { TranslationService } from 'src/app/modules/shared/services/translation.service';

@Component({
  selector: 'app-closewindow',
  templateUrl: './closewindow.component.html',
  styleUrls: ['./closewindow.component.scss']
})
export class CloseWindowComponent implements OnInit, AfterViewInit {

  isThemeDark = false;
  device: any;
  model: any = {};
  isConfirmed = false;
  confirmKey: string | null | undefined;
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


    this.route.queryParams.subscribe(params => {

      this.confirmKey = params.key;
    })



  }
  ngAfterViewInit(): void {
    this.authService.logout(false);
  }

  ngOnInit(): void {

  }




}
