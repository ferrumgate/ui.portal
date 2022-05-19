import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { catchError, map, of, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const key = `ferrumgate_session`;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const routerServiceSpy = jasmine.createSpyObj('Router', ['navigate'])
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerServiceSpy },
        TranslateService,
      ]
    });

    service = TestBed.inject(AuthenticationService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('currentSession must be null', () => {
    expect(service.currentSession).toBeNull();
  });
  it('currentSession must not be null', () => {
    sessionStorage.setItem(AuthenticationService.SessionKey, JSON.stringify({}))
    const session = service.getSavedSession();
    expect(session).toBeTruthy();
  });

  it('loginLocal success', (done) => {
    httpClientSpy.post.and.returnValue(of({ status: 200, body: { accessToken: '', refreshToken: '', user: {} } }));
    service.loginLocal('someone@ferrumgate.com', 'somepass').subscribe(x => {

      expect(service.currentSession).toBeTruthy();
      done();
    });
  });

  it('loginLocal failure', (done) => {
    //mock service
    httpClientSpy.post.and.returnValue(throwError(() => { return { status: 401 } }));
    service.loginLocal('someone@ferrumgate.com', 'somepass').subscribe({
      next: (x: any) => x,
      error: (err: any) => {
        expect(service.currentSession).toBeNull();
        done();
      }
    })

  });
  it('logout', (done) => {
    //mock router
    routerServiceSpy.navigate.and.returnValue('');
    sessionStorage.setItem(AuthenticationService.SessionKey, 'something');
    service.logout();
    const item = sessionStorage.getItem(AuthenticationService.SessionKey);
    expect(item).toBeFalsy();
    expect(routerServiceSpy.navigate).toHaveBeenCalled();
    done();


  });

});
