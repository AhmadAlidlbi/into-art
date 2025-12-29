import { Routes } from '@angular/router';

export const LEGAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./legal').then((m) => m.LegalPage),
  },
];
