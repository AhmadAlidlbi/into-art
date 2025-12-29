import { Routes } from '@angular/router';
import { readyPagesGuard } from './core/guards/ready-pages.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [readyPagesGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },

      {
        path: 'about',
        loadChildren: () => import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./features/services/services.routes').then((m) => m.SERVICES_ROUTES),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
      },
      {
        path: 'portfolio',
        loadChildren: () =>
          import('./features/portfolio/portfolio.routes').then((m) => m.PORTFOLIO_ROUTES),
      },
      {
        path: 'faq',
        loadChildren: () => import('./features/faq/faq.routes').then((m) => m.FAQ_ROUTES),
      },
      {
        path: 'blog',
        loadChildren: () => import('./features/blog/blog.routes').then((m) => m.BLOG_ROUTES),
      },
      {
        path: 'book-consultation',
        loadChildren: () =>
          import('./features/booking/booking.routes').then((m) => m.BOOKING_ROUTES),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./features/legal/legal.routes').then((m) => m.LEGAL_ROUTES),
      },
      {
        path: 'not-found',
        loadChildren: () =>
          import('./features/not-found/not-found.routes').then((m) => m.NOT_FOUND_ROUTES),
      },
      {
        path: 'under-construction',
        loadChildren: () =>
          import('./features/under-construction/under-construction.routes').then(
            (m) => m.UNDER_CONSTRUCTION_ROUTES
          ),
      },

      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
