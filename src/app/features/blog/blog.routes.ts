import { Routes } from '@angular/router';

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog').then((m) => m.BlogPage),
  },
  {
    path: ':slug',
    loadComponent: () => import('./components/post/post').then((m) => m.PostPage),
  },
];
