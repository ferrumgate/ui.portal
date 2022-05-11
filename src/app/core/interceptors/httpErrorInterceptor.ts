import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpEventType } from '@angular/common/http';
import { interval, Observable, of, throwError } from 'rxjs';
import { catchError, map, finalize, retryWhen, take, delay, concatMap, delayWhen, scan } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';


import { NotificationService } from '../services/notification.service';




@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const notificationService = this.injector.get(NotificationService);
        const authenticationService = this.injector.get(AuthenticationService);
        return next.handle(request).pipe(
            map((event: any) => {
                console.log('httperror interceptor is working');
                return event;
            }),
            retryWhen(errors =>
                errors.pipe(
                    delayWhen((err: any) =>
                        ((err.status >= 501 || !err.status == undefined) ? interval(1000) : of(err))
                            .pipe(
                                scan((count: any, currentErr: any) => {
                                    if (count >= 2 || (currentErr.status && currentErr.status < 501)) {
                                        throw currentErr;
                                    } else {
                                        return count += 1;
                                    }
                                }, 0))
                    ))),
            catchError((resp: any) => {
                if (resp.status == 428)//captcha required
                {
                    let url = new URL(window.location.href);
                    url.searchParams.set('isCaptchaEnable', 'true');
                    location.href = url.toString();


                }
                else
                    if (resp.status === 401) {

                        if (window.location.href.indexOf('/register') >= 0 || window.location.href.indexOf('/login') >= 0 || window.location.href.indexOf('/forgot-password-confirm') >= 0 || window.location.href.indexOf('/account-created-parent') >= 0) {

                        } else {
                            // auto logout if 401 response returned from api
                            authenticationService.logout();
                            if (window.location.href.indexOf('/login') === -1) { // reload if not login page
                                location.href = '/login';
                            }

                        }


                    }
                return throwError(resp);
            }), finalize(() => {


            }));
    }
}
