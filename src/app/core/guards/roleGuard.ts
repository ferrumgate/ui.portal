import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { LoggerService } from '../../modules/shared/services/logger.service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private logger: LoggerService,
        public auth: AuthenticationService,
        public router: Router,
    ) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {

        return true;

    }
}
