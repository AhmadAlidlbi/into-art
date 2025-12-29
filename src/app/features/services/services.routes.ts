import { Routes } from '@angular/router';

export const SERVICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./services').then((m) => m.ServicesPage),
  },
  {
    path: ':slug',
    loadComponent: () => import('./components/service-details/service-details').then((m) => m.ServiceDetailsPage),
  },
];
