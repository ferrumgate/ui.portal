import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { delay, filter, of, switchMap, take } from 'rxjs';
import { fadeAnimation } from './app.animation';


import { AuthenticationService } from './modules/shared/services/authentication.service';
import { ConfigService } from './modules/shared/services/config.service';
import { LoadingService } from './modules/shared/services/loading.service';
import { LoggerService } from './modules/shared/services/logger.service';
import { TranslationService } from './modules/shared/services/translation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeAnimation
  ]

})
export class AppComponent implements OnInit {
  /**
   *
   */

  private isDark = false;
  @HostBinding('class')
  get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
  }
  constructor(private router: Router, private configService: ConfigService,
    private loggerService: LoggerService,
    private authenticationService: AuthenticationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private loadingService: LoadingService,

  ) {

    this.matIconRegistry.addSvgIcon(
      "social-github",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/github.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-linkedin",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/linkedin.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-google",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/google.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-microsoft",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/microsoft.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-apple",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/apple.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-auth0",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/auth0.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "linux",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/linux.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "windows",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/windows.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "apple",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/apple.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "debian",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/debian.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "recaptcha",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/recaptcha.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "services",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/services.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "elasticsearch",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/elasticsearch.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "ip-address",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/ip-address.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "dns",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/dns.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "domain",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/domain.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "api",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/api.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "pki",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/pki.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "cert",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/cert.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "lets-encrypt",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/lets-encrypt.svg")
    );
    // subsribe to theme changes
    this.configService.themeChanged.subscribe(x => {
      this.isDark = x == 'dark';
    })

    const user = this.authenticationService.currentSession?.currentUser;
    this.configService.init(user?.id || 'empty');


  }
  ngOnInit(): void {

    //check token for time validity
    this.authenticationService.checkSessionIsValid();
  }

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }



}
