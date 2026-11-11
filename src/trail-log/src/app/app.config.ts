import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TrailsStore } from './trails/trails-store';

export const appConfig: ApplicationConfig = {
  providers: [TrailsStore, provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
