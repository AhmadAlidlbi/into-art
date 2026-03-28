import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { CookieConsentComponent } from './shared/cookie-consent/cookie-consent';
import { WhatsappFloatComponent } from './shared/ui/whatsapp-float/whatsapp-float';
import { ScrollTopComponent } from "./shared/ui/scroll-top/scroll-top";

const SCROLL_KEY = 'app_scroll_y';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CookieConsentComponent,
    WhatsappFloatComponent,
    ScrollTopComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('into-art');
  isDrawerOpen = signal(false);

  private isFirstNav = true;
  private readonly isReload =
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      ?.type === 'reload';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Save scroll position before the page unloads (refresh / close)
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isFirstNav) {
          this.isFirstNav = false;
          if (this.isReload) {
            // Restore saved scroll position after layout settles
            const saved = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0);
            if (saved > 0) {
              requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'instant' }));
            }
            return;
          }
        }
        // New route navigation → always scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
  }
}
