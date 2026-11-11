import { Routes } from '@angular/router';
import { State } from './state';
import { Home } from './pages/home';
import { Prefs } from './pages/prefs';
import { StateStore } from './state-store';
import { Resources } from './pages/resources';

export const stateRoutes: Routes = [
  {
    // /state
    path: '',
    component: State,
    providers: [StateStore],
    // state/**
    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'signals',
        loadComponent: () => import('./pages/signals').then((p) => p.Signals),
      },
      {
        path: 'prefs',
        component: Prefs,
      },
      {
        path: 'resources',
        component: Resources,
      },

      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];
