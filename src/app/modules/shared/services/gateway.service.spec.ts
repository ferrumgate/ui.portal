import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ConfigService } from './config.service';
import { GatewayService } from './gateway.service';

import { NetworkService } from './network.service';



describe('GatewayService', () => {
  let service: GatewayService;
  let httpClient: HttpClient;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientModule],
      providers: [TranslateService, ConfigService, HttpClient]
    });
    service = TestBed.inject(GatewayService);
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
