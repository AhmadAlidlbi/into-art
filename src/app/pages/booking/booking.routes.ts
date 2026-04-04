import { Routes } from '@angular/router';

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./book-consultation').then((m) => m.BookConsultationPage),
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/booking-success/booking-success').then((m) => m.BookingSuccessPage),
  },
];
