import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.routes').then((m) => m.HOME_ROUTES),
      },

      {
        path: 'about',
        loadChildren: () => import('./pages/about/about.routes').then((m) => m.ABOUT_ROUTES),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./pages/services/services.routes').then((m) => m.SERVICES_ROUTES),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./pages/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
      },
      {
        path: 'faq',
        loadChildren: () => import('./pages/faq/faq.routes').then((m) => m.FAQ_ROUTES),
      },
      {
        path: 'book-consultation',
        loadChildren: () => import('./pages/booking/booking.routes').then((m) => m.BOOKING_ROUTES),
      },
      {
        path: 'contact',
        loadChildren: () => import('./pages/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/legal/legal.routes').then((m) => m.LEGAL_ROUTES),
      },
      {
        path: 'not-found',
        loadChildren: () =>
          import('./pages/not-found/not-found.routes').then((m) => m.NOT_FOUND_ROUTES),
      },

      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
