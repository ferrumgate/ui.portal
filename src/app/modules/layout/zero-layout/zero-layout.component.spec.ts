import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { SharedModule } from '../../shared/shared.module';

import { ZeroLayoutComponent } from './zero-layout.component';

describe('ZeroLayoutComponent', () => {
  let component: ZeroLayoutComponent;
  let fixture: ComponentFixture<ZeroLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZeroLayoutComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, SharedModule],
      providers: [
        ConfigService, AuthenticationService, TranslationService, TranslateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.zerolayout')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.zerolayout app-themeselector')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.zerolayout app-footer')).toBeTruthy();
  });
});
