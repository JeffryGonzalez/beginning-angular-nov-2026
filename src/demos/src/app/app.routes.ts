import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { About } from './pages/about';
import { Notfound } from './pages/notfound';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'state',
    // this will put all the code for "state" into a different javascript file (bundle, or "chunk"), than the app part
    // by default, it will not load this until the user goes to that route - so it is "lazy" (you can change that)
    // "Lazy Chunks"
    loadChildren: () => import('./areas/state/state.routes').then((r) => r.stateRoutes),
  },
  {
    path: '**',
    component: Notfound,
  },
];
