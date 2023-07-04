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
import { ConfigBrand } from '../shared/models/config';
import { SSubscription } from '../shared/services/SSubscribtion';

@Component({
  selector: 'app-confirmemail',
  templateUrl: './confirmemail.component.html',
  styleUrls: ['./confirmemail.component.scss']
})
export class ConfirmEmailComponent implements OnInit, AfterViewInit {

  isThemeDark = false;
  device: any;
  model: any = {};
  isConfirmed = false;
  confirmKey: string | null | undefined;
  brand: ConfigBrand = {};
  private allSubs = new SSubscription();
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

    this.brand = this.configService.brand;
    this.allSubs.addThis =
      this.configService.dynamicConfigChanged.subscribe(x => {
        this.brand = this.configService.brand;
      })



  }
  ngAfterViewInit(): void {
    this.execute().subscribe();
  }

  ngOnInit(): void {

  }
  ngOnDestroy() {

    this.allSubs.unsubscribe();
  }

  execute(wait = 1000) {

    return this.confirm(wait);

  }

  private confirm(wait: number) {
    return of('').pipe(
      delay(wait),
      switchMap(x => {
        return this.authService.confirmUserEmail(this.confirmKey || '');
      }),
      map(x => {
        this.isConfirmed = true;
      }),
      delay(2000),
      map(x => {

        this.router.navigate(['/login']);
      }))
  }

}
