import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

import { environment } from 'src/environments/environment';
import { LoadingService } from '../services/loading.service';
;
import { LoggerService } from '../services/logger.service';
import { TranslationService } from '../services/translation.service';

// errors-handler.ts
@Injectable()
export class ErrorInterceptor implements ErrorHandler {
  constructor(
    // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
    private injector: Injector
  ) { }

  handleError(error: Error | HttpErrorResponse) {
    const loggerService = this.injector.get(LoggerService);
    const notificationService = this.injector.get(NotificationService);
    const loadingService = this.injector.get(LoadingService);
    loadingService.hide();
    const translateService = this.injector.get(TranslationService);

    // throw error;

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        notificationService.danger('No Internet Connection');
      } else {
        // Handle Http Error (error.status === 403, 404...)
        const status = error.status;
        if (error.error.code) {
          const message = translateService.translate(error.error.code);
          loggerService.log(`${status} - ${message}`);
          if (error.error.code != 'ErrOAuthJwtVerificationFailed') {
            notificationService.error(`${message}`);
          }
        } else
          if (error.statusText == 'Service Temporarily Unavailable') {

            const message = translateService.translate(error.statusText);
            notificationService.error(translateService.translate(message));
            loggerService.log(`${status} - ${message}`);

          } else
            if (error.statusText == 'Bad Gateway') {
              const message = translateService.translate(error.statusText);
              notificationService.error(translateService.translate(message));
              loggerService.log(`${status} - ${message}`);
            } else
              if (error.statusText == 'Gateway Timeout') {
                const message = translateService.translate(error.statusText);
                notificationService.error(translateService.translate(message));
                loggerService.log(`${status} - ${message}`);
              } else {

                const message = translateService.translate(error.statusText);
                notificationService.error(translateService.translate('ErrOAuthUnknownError'));
                loggerService.log(`${status} - ${message}`);
              }
      }
    } else {

      const message = translateService.translate(error.message);
      loggerService.log(message);
      throw error;

    }


    // Log the error anyway
    if (error && error.name)
      loggerService.log(error.name);
  }
}
