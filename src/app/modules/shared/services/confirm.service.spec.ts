import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MaterialModule } from '../material-module';
import { ConfigService } from './config.service';
import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  let service: ConfirmService;
  let httpClient: HttpClient;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, SharedModule, TranslateModule.forRoot(), HttpClientModule, MaterialModule],
      providers: [TranslateService, ConfigService, HttpClient, MatDialog]

    });
    service = TestBed.inject(ConfirmService);
    httpClient = TestBed.inject(HttpClient);
    spyOn(httpClient, 'get').and.returnValue(of({}));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('show', () => {

    service.show('test', 'testmessage')
      .subscribe(x => {

      });

  });

});

