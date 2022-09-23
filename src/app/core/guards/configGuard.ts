import { Injectable, Injector } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RBACDefault } from 'src/app/modules/shared/models/rbac';
import { ConfigService } from 'src/app/modules/shared/services/config.service';
import { AuthenticationService } from '../../modules/shared/services/authentication.service';
import { LoggerService } from '../../modules/shared/services/logger.service';


//  some pages not works
//  because of configs, forexample /register /forgotpassword
@Injectable()
export class ConfigGuard implements CanActivate {

    constructor(private router: Router, private logger: LoggerService, private authService: AuthenticationService, private configService: ConfigService) { }

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const isConfigured = this.configService.isAllReadyConfigured;
        const isEnabledRegistered = this.configService.isEnabledRegister;
        const isEnabledForgotPassword = this.configService.isEnabledForgotPassword;
        const config = router.data.config;
        if (isConfigured && config.isEnabledRegister && isEnabledRegistered)
            return true;
        if (isConfigured && config.isEnabledForgotPassword && isEnabledForgotPassword)
            return true;

        this.router.navigate(['/pagenotfound']);
        return false;
    }
}