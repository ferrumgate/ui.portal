import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthenticationService } from './core/services/authentication.service';
import { ConfigService } from './core/services/config.service';
import { MaterialModule } from './modules/shared/material-module';
import { SharedModule } from './modules/shared/shared.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

describe('AppComponent', () => {
  let matIconRegistry: MatIconRegistry;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, TranslateModule.forRoot(), SharedModule, MaterialModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [HttpClient, TranslateService, ConfigService,
        AuthenticationService, MatIconRegistry,

      ]
    }).compileComponents();
    /* let matIconRegistry = TestBed.inject(MatIconRegistry);
    let domSanitizer = TestBed.inject(DomSanitizer);
    matIconRegistry.addSvgIcon(
      "social-github",
      domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/github.svg")
    );
    matIconRegistry.addSvgIcon(
      "social-linkedin",
      domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/linkedin.svg")
    );
    matIconRegistry.addSvgIcon(
      "social-google",
      domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/google.svg")
    );
    matIconRegistry.addSvgIcon(
      "social-microsoft",
      domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/social/microsoft.svg")
    ); */

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });



  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });
});
