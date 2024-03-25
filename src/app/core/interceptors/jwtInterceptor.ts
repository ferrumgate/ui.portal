import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    /**
     *
     */
    constructor(private inject: Injector) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            // setHeaders: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        const authService = this.inject.get(AuthenticationService);
        // add authorization header with jwt token if available
        const currentSession = authService.currentSession;
        if (currentSession && currentSession.accessToken) {
            const urls = ['/register', '/auth/token/access']

            if (!urls.find(x => request.url.includes(x))) {
                request = request.clone({
                    setHeaders: {
                        'Authorization': `Bearer ${currentSession.accessToken}`,
                    }
                });

            }
        }

        return next.handle(request);

    }
}
