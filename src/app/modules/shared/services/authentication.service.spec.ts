import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { catchError, map, of, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const key = `ferrumgate_session`;
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },

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
    sessionStorage.setItem(AuthenticationService.StorageSessionKey, JSON.stringify({}))
    const session = service.getSavedSession();
    expect(session).toBeTruthy();
  });

  it('loginLocal success with 2FA', ((done) => {
    httpClientSpy.post.and.returnValue(of({ key: 'bla', is2FA: true }));
    routerSpy.navigate.and.returnValue(of(''));


    service.loginLocal('someone@ferrumgate.com', 'somepass').subscribe(x => {
      expect(service.currentSession).toBeFalsy();
      expect(routerSpy.navigate).toHaveBeenCalled();

      done();
    });


  }));
  it('loginLocal success without 2FA', ((done) => {
    httpClientSpy.post.and.returnValues(
      of({ key: 'bla', is2FA: false }),
      of({ accessToken: 'bla', refreshToken: "token", user: {} }));
    httpClientSpy.get.and.returnValue(of({ id: 'bla', roles: [] }));


    routerSpy.navigate.and.returnValue(of(''));


    service.loginLocal('someone@ferrumgate.com', 'somepass').subscribe(x => {
      expect(service.currentSession).toBeTruthy();

      //expect(getUserCurrentSpy).toHaveBeenCalled();
      done();
    });


  }));


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
    routerSpy.navigate.and.returnValue('');
    sessionStorage.setItem(AuthenticationService.StorageSessionKey, 'something');
    service.logout();
    const item = sessionStorage.getItem(AuthenticationService.StorageSessionKey);
    expect(item).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalled();
    done();


  });

  it('2fa confirm', (done) => {

    //mock service

    httpClientSpy.post.and.returnValues(
      of({ key: 'bla', is2FA: false }),
      of({ accessToken: 'bla', refreshToken: "token", user: {} }));
    httpClientSpy.get.and.returnValue(of({ id: 'bla', roles: [] }));
    routerSpy.navigate.and.returnValue(of(''));
    service.confirm2FA('bla', 'bla').subscribe(x => {
      expect(service.currentSession).toBeTruthy();
      done();
    })
  });

  it('register', (done) => {

    //mock service
    httpClientSpy.post.and.returnValue(of({ result: true }));
    service.register('bla', 'bla').subscribe(x => {
      expect(x.result).toBeTruthy();
      done();
    })
  });


  it('getUserCurrent', (done) => {

    //mock service
    httpClientSpy.post.and.returnValue(of({ accessToken: '' }));
    httpClientSpy.get.and.returnValue(of({ id: 'someid' }));
    service.getAccessToken('key').subscribe(x => {

      service.getUserCurrent().subscribe(x => {
        expect(x).toBeTruthy();

        expect(service.currentSession?.currentUser).toBeTruthy();
        expect(service.currentSession?.currentUser.id).toBe('someid');
        done();
      })

    })

  });

  it('getRefreshToken', (done) => {

    //mock service
    httpClientSpy.post.and.returnValue(of({ accessToken: 'asd', refreshToken: 'def' }));

    service.getRefreshToken().subscribe(x => {


      expect(x).toBeTruthy();

      expect(service.currentSession?.accessToken).toBeTruthy();
      expect(service.currentSession?.refreshToken).toBeTruthy();
      done();


    })

  });

});
