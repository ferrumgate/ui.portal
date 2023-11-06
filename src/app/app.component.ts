import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterState } from '@angular/router';
import { delay, filter, of, switchMap, take } from 'rxjs';
import { fadeAnimation } from './app.animation';


import { AuthenticationService } from './modules/shared/services/authentication.service';
import { ConfigService } from './modules/shared/services/config.service';
import { LoadingService } from './modules/shared/services/loading.service';
import { LoggerService } from './modules/shared/services/logger.service';
import { TranslationService } from './modules/shared/services/translation.service';

declare let gtag: Function;

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
    private renderer: Renderer2,
    private titleService: Title,
    private loadingService: LoadingService,

    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.injectScripts();
    }
    this.handleRouteEvents();



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
      "social-azure",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/azure.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-openid",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/openid.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-authentication",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/authentication.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "social-radius",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/radius.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "social-oauth2",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/oauth2.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-saml",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/saml.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "social-okta",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/okta.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "social-onelogin",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/onelogin.svg")
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
    this.matIconRegistry.addSvgIcon(
      "brand",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/b-letter.svg")
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

  injectScripts() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZXZJ9QM2WV';
    this.renderer.appendChild(this.document.body, script);

    const scriptBody = this.renderer.createElement('script');
    scriptBody.type = 'text/javascript';
    scriptBody.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', 'G-ZXZJ9QM2WV');
    `;
    this.renderer.appendChild(this.document.body, scriptBody);
  }

  handleRouteEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const title = this.getTitle(event, this.router.routerState, this.router.routerState.root).join('-');
        this.titleService.setTitle(title);

        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects?.split('?')[0],
          page_location: this.document.location.href.split('?')[0]
        })
      }
    });
  }

  getTitle(event: NavigationEnd, state: RouterState, parent: ActivatedRoute): string[] {
    //console.log(event.url);
    const paths = event.url.split('/').filter(x => x).map(y => {
      let path = y.split('?')[0]
      if (!path) return '';
      return path.charAt(0).toUpperCase() + path.slice(1);
    }
    ).filter(z => z);
    /*  const data = [];
     if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
       data.push(parent.snapshot.data['title']);
     }
     if (state && parent && parent.firstChild) {
       data.push(...this.getTitle(state, parent.firstChild));
     } */
    return paths.length ? paths : ["Management"]

  }



}
