import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './modules/login/login.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { translateHttpLoaderFactory, TranslationService } from './core/services/translation.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationService } from './core/services/authentication.service';
import { NotificationService } from './core/services/notification.service';
import { JwtInterceptor } from './core/interceptors/jwtInterceptor';
import { HttpErrorInterceptor } from './core/interceptors/httpErrorInterceptor';
import { ErrorInterceptor } from './core/interceptors/errorInterceptor';
import { ZeroLayoutComponent } from './modules/layouts/zero-layout/zero-layout.component';
import { DefaultLayoutComponent } from './modules/layouts/default-layout/default-layout.component';
import { AuthenticationGuard } from './core/guards/authenticationGuard';
import { MaterialModule } from './modules/material-module';


@NgModule({
  declarations: [
    AppComponent,
    ZeroLayoutComponent,
    DefaultLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,

  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    NotificationService,
    TranslationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
