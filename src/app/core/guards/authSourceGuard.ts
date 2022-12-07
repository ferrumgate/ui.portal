import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { LoggerService } from '../../modules/shared/services/logger.service';


@Injectable({ providedIn: 'root' })
export class AuthSourceGuard implements CanActivate {
    constructor(
        private logger: LoggerService,
        private auth: AuthenticationService,
        private router: Router,
    ) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {

        const sources = route.data.authSources as string[];
        if (this.auth.currentSession?.currentUser?.source && sources.includes(this.auth.currentSession.currentUser.source))
            return true;
        this.router.navigate(['/login']);
        return false;

    }
}
