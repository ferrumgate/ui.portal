import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { LoggerService } from '../../modules/shared/services/logger.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(private router: Router, private logger: LoggerService,
        private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.authService.currentSession) {
            // logged in so return true
            return true;
        }
        this.logger.error(`auth failed`);
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}
