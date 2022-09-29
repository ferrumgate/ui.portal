import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthenticationService } from './modules/shared/services/authentication.service';
import { ConfigService } from './modules/shared/services/config.service';
import { MaterialModule } from './modules/shared/material-module';
import { SharedModule } from './modules/shared/shared.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('AppComponent', () => {

  beforeEach(async () => {
    let httpClient: HttpClient;
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, TranslateModule.forRoot(), SharedModule, MaterialModule, MatIconTestingModule, NoopAnimationsModule
      ],
      declarations: [
        AppComponent, MatIcon
      ],
      providers: [HttpClient, TranslateService, ConfigService,
        AuthenticationService, MatIconRegistry,

      ]
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'get').and.returnValue(of({}))

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
