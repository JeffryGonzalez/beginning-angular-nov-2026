import { Routes } from '@angular/router';
import { State } from './state';
import { Home } from './pages/home';

export const stateRoutes: Routes = [
  {
    // /state
    path: '',
    component: State,
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
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];
