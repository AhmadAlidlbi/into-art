import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./projects').then((m) => m.ProjectsPage),
  },
  {
    path: ':slug',
    loadComponent: () => import('./components/project-details/project-details').then((m) => m.ProjectDetailsPage),
  },
];
