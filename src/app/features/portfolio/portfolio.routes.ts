import { Routes } from '@angular/router';

export const PORTFOLIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./portfolio').then((m) => m.PortfolioPage),
  },
];
