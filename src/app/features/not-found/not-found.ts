import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

type QuickLink = { label: string; path: string };

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
})
export class NotFoundPage {
  quickLinks: QuickLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/under-construction' },
    { label: 'Portfolio', path: '/under-construction' },
    { label: 'Projects', path: '/under-construction' },
    { label: 'Blog', path: '/under-construction' },
    { label: 'FAQ', path: '/under-construction' },
    { label: 'Book Consultation', path: '/book-consultation' },
    { label: 'Contact', path: '/under-construction' },
  ];

  q = signal<string>('');

  filteredLinks = computed(() => {
    const term = this.q().trim().toLowerCase();
    if (!term) return this.quickLinks;

    return this.quickLinks.filter((l) => {
      return (
        l.label.toLowerCase().includes(term) ||
        l.path.toLowerCase().includes(term)
      );
    });
  });

  constructor(private router: Router) {}

  setQ(v: string): void {
    this.q.set(v);
  }

  goBack(): void {
    // If there is a history stack, go back; otherwise, return home.
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    this.router.navigateByUrl('/');
  }

  trackByPath(_: number, l: QuickLink): string {
    return l.path;
  }
}
