import { Routes } from '@angular/router';

export const UNDER_CONSTRUCTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./under-construction').then((m) => m.UnderConstructionPage),
  },
];
