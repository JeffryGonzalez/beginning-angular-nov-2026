import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { TrailsStore } from './trails/trails-store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ExpensiveService, NewExpensiveService } from './dev/expensive-service';

// const theServiceToUse = new NewExpensiveService();
// do some setup, set some parameters, etc.
export const appConfig: ApplicationConfig = {
  providers: [
    ExpensiveService, //
    {
      provide: ExpensiveService,
      useFactory: () => {
        // setup code here that runs lazily, and you should return the instance of the service

        const theServiceToUse = new NewExpensiveService();
        // do some setup with this service, and then return it.
        return theServiceToUse;
      },
    },
    TrailsStore,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([/*interceptor functions here */])),
  ],
};
