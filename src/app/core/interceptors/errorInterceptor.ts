import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

import { environment } from 'src/environments/environment';
import { LoadingService } from '../services/loading.service';
;
import { LoggerService } from '../services/logger.service';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class ErrorInterceptor implements ErrorHandler {
  constructor(
    private injector: Injector
  ) { }

  handleError(error: Error | HttpErrorResponse) {
    const translateService = this.injector.get(TranslationService);
    const loggerService = this.injector.get(LoggerService);
    const notificationService = this.injector.get(NotificationService);
    const loadingService = this.injector.get(LoadingService);
    loadingService.hide();



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
          notificationService.error(`${message}`);

        } else
          if (error.statusText == 'Service Temporarily Unavailable') {

            const message = translateService.translate(error.statusText);
            notificationService.error(message);
            loggerService.log(`${status} - ${message}`);

          } else
            if (error.statusText == 'Bad Gateway') {
              const message = translateService.translate(error.statusText);
              notificationService.error(message);
              loggerService.log(`${status} - ${message}`);
            } else
              if (error.statusText == 'Gateway Timeout') {
                const message = translateService.translate(error.statusText);
                notificationService.error(message);
                loggerService.log(`${status} - ${message}`);
              } else {

                const message = translateService.translate(error.statusText);
                notificationService.error(message);
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
