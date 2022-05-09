import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { ThemeSelectorComponent } from '../shared/themeselector/themeselector.component';

import { LoginComponent } from './login.component';
import { LoginModule } from './login.module';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), BrowserAnimationsModule, SharedModule],
      providers: [
        ConfigService, AuthenticationService, TranslationService, TranslateService
      ]

    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.login')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.login > [fxLayout="row"]').length).toBe(2);


  });
});
