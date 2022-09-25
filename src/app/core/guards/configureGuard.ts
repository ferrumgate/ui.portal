import { Injectable, Injector } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RBACDefault } from 'src/app/modules/shared/models/rbac';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { LoggerService } from '../../modules/shared/services/logger.service';


// for /configure page
// only admin user if not allready configured
// 
@Injectable()
export class ConfigureGuard implements CanActivate {

    constructor(private router: Router, private logger: LoggerService,
        private authService: AuthenticationService, private configService: ConfigService) { }

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.configService.isAllReadyConfigured)
            if (this.authService.currentSession?.currentUser?.username == "admin")
                if (this.authService.currentSession?.currentUser?.roles?.find(x => x.id == RBACDefault.roleAdmin.id))
                    return true;
        if (this.authService.currentSession?.currentUser)
            this.router.navigate(['/pagenotfound']);
        else
            this.router.navigate(['/login']);
        return false;
    }
}