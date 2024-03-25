import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { LoggerService } from '../../modules/shared/services/logger.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private logger: LoggerService,
        private auth: AuthenticationService,
        private router: Router,
    ) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {

        const roleIds = route.data.roleIds as any;
        for (let roleId of roleIds)
            if (this.auth.currentSession?.currentUser?.roles?.find(x => x.id == roleId)) {
                return true;
            }
        for (let roleId of roleIds) {
            console.log(this.auth.currentSession)
            console.log(this.auth.currentSession?.currentUser)
            console.log(this.auth.currentSession?.currentUser?.roles)
            console.log(this.auth.currentSession?.currentUser?.roles?.find(x => x.id == roleId))
        }

        console.log(this.auth.currentSession)
        console.log(`${roleIds} roleGuard`)
        this.router.navigate(['/login']);
        return false;

    }
}
