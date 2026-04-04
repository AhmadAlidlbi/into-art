import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { WhatsappFloatComponent } from './shared/ui/whatsapp-float/whatsapp-float';
import { ScrollTopComponent } from './shared/ui/scroll-top/scroll-top';

const SCROLL_KEY = 'app_scroll_y';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsappFloatComponent,
    ScrollTopComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  isDrawerOpen = signal(false);

  private isFirstNav = true;
  private readonly isReload =
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      ?.type === 'reload';

  constructor(private router: Router) {}

  ngOnInit(): void {
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isFirstNav) {
          this.isFirstNav = false;
          if (this.isReload) {
            const saved = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0);
            if (saved > 0) {
              requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'instant' }));
            }
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
  }

  hideLayout(): boolean {
    return this.router.url.startsWith('/review-submit');
  }
}