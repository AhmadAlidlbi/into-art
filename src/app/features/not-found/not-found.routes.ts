import { Routes } from '@angular/router';

export const NOT_FOUND_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./not-found').then((m) => m.NotFoundPage),
  },
];
