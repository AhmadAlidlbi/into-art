import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

const READY = new Set<string>([
  '', // home
  'under-construction',
  'not-found',
  'book-consultation',

  // add ONLY the pages you want accessible right now:
  // 'services',
  // 'projects',
  // 'about',
  // 'contact',
  // 'privacy-policy',
]);

function normalize(url: string): string {
  // remove query/hash + trim slashes
  const clean = url.split('?')[0].split('#')[0];
  return clean.replace(/^\/+|\/+$/g, '');
}

export const readyPagesGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const router = inject(Router);

  const path = normalize(state.url); // '' for '/'

  // allow any "ready" top-level path
  if (READY.has(path)) return true;

  // also allow sub-routes under a ready section if you want:
  // if (path.startsWith('projects/')) return true;

  return router.parseUrl('/under-construction');
};
