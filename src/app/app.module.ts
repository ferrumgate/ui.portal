import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationService } from './core/services/authentication.service';
import { NotificationService } from './core/services/notification.service';
import { JwtInterceptor } from './core/interceptors/jwtInterceptor';
import { HttpErrorInterceptor } from './core/interceptors/httpErrorInterceptor';
import { ErrorInterceptor } from './core/interceptors/errorInterceptor';

import { AuthenticationGuard } from './core/guards/authenticationGuard';
import { MaterialModule } from './modules/shared/material-module';


import { translationHttpLoaderFactory, TranslationService } from './core/services/translation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZeroLayoutModule } from './modules/layout/zero-layout/zero-layout.module';
import { DefaultLayoutModule } from './modules/layout/default-layout/default-layout.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { ConfigService } from './core/services/config.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translationHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ZeroLayoutModule,
    DefaultLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    LayoutModule

  ],
  providers: [
    TranslateService,
    AuthenticationGuard,
    AuthenticationService,
    NotificationService,
    TranslationService,
    ConfigService,
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
