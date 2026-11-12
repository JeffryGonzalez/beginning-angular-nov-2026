import { Routes } from '@angular/router';
import { TrailList } from './trails/trails-list';
import { Reviews } from './reviews/reviews';

export const routes: Routes = [
  {
    path: '',
    component: TrailList,
  },
  {
    path: 'reviews/:id',
    component: Reviews,
  },
];
