import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { interval, Observable, of, throwError } from 'rxjs';
import { catchError, map, finalize, retryWhen, take, delay, concatMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';


import { NotificationService } from '../services/notification.service';



@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(map((event: HttpEvent<any>) => event));
        /*    const notificationService = this.injector.get(NotificationService);
           return next.handle(request).pipe(
               map((event: HttpEvent<any>) => {
                   if (event instanceof HttpResponse) {
                       // console.log('event--->>>', event);
                   }
                   return event;
               }),
               retryWhen(error => {
   
                   return error.delayWhen(err => (err.status >= 501 || !err.status == undefined) ? interval(1000) : of(err)).scan((count: any, currentErr: any) => {
                       if (count >= 2 || (currentErr.status && currentErr.status < 501)) {
                           throw currentErr;
                       } else {
                           return count += 1;
                       }
                   }, 0);
               }),
               catchError(err => {
      const notificationService = this.injector.get(NotificationService);
           return next.handle(request).pipe(
               map((event: HttpEvent<any>) => {
                   if (event instanceof HttpResponse) {
                       // console.log('event--->>>', event);
                   }
                   return event;
               }),
               retryWhen(error => {
   
                   return error.delayWhen(err => (err.status >= 501 || !err.status == undefined) ? interval(1000) : of(err)).scan((count: any, currentErr: any) => {
                       if (count >= 2 || (currentErr.status && currentErr.status < 501)) {
                           throw currentErr;
                       } else {
                           return count += 1;
                       }
                   }, 0);
               }),
               catchError(err => {
   
                   if (err.status === 401) {
   
                       if (window.location.href.indexOf('/register') >= 0 || window.location.href.indexOf('/login') >= 0 || window.location.href.indexOf('/forgot-password-confirm') >= 0 || window.location.href.indexOf('/account-created-parent') >= 0) {
   
                       } else {
                           // auto logout if 401 response returned from api
                           this.authenticationService.logout();
                           if (window.location.href.indexOf('/login') === -1) { // reload if not login page
                               location.href = '/#/login';
                           }
   
                       }
   
   
                   }
   
                   throwError(err);
               }), finalize(() => {
   
   
               }));
                   if (err.status === 401) {
   
                       if (window.location.href.indexOf('/register') >= 0 || window.location.href.indexOf('/login') >= 0 || window.location.href.indexOf('/forgot-password-confirm') >= 0 || window.location.href.indexOf('/account-created-parent') >= 0) {
   
                       } else {
                           // auto logout if 401 response returned from api
                           this.authenticationService.logout();
                           if (window.location.href.indexOf('/login') === -1) { // reload if not login page
                               location.href = '/#/login';
                           }
   
                       }
   
   
                   }
   
                   throwError(err);
               }), finalize(() => {
   
   
               })); */
    }
}
