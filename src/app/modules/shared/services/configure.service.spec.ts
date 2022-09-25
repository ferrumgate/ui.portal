import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigService } from './config.service';
import { ConfigureService } from './configure.service';



describe('ConfigureService', () => {
  let service: ConfigureService;
  let httpClient: HttpClient;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [TranslateService, ConfigService, HttpClient]
    });
    service = TestBed.inject(ConfigureService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('configure', () => {

    //spyOn(httpClient, 'post').and.returnValue(of({}));
    //service.configure({} as any).subscribe();
  });





});
