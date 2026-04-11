import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { WhatsappFloatComponent } from './shared/ui/whatsapp-float/whatsapp-float';
import { ScrollTopComponent } from './shared/ui/scroll-top/scroll-top';
import { RouteLoaderComponent } from './shared/ui/route-loader/route-loader';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE_KEY } from './shared/constants/whatsapp.constants';

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
    RouteLoaderComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  isDrawerOpen = signal(false);
  isRouteLoading = signal(false);

  readonly whatsappNumber = WHATSAPP_NUMBER;

  /** Reactively re-translates whenever the language changes. */
  readonly whatsappMessage = toSignal(
    this.translate.stream(WHATSAPP_MESSAGE_KEY),
    { initialValue: this.translate.instant(WHATSAPP_MESSAGE_KEY) }
  );

  private isFirstNav = true;
  private readonly isReload =
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      ?.type === 'reload';

  private loaderTimeout: number | null = null;

  constructor() {}

  ngOnInit(): void {
    // ─── Dismiss the initial app loader ──────────────────
    this.dismissLoader();

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    });

    // ─── Router event handling ───────────────────────────
    this.router.events.subscribe((event) => {
      // ── NavigationStart ────────────────────────────────
      if (event instanceof NavigationStart) {
        // Show loader after a small delay (avoids flash on cached chunks)
        this.loaderTimeout = window.setTimeout(() => {
          this.isRouteLoading.set(true);
        }, 120);

        // Scroll to top immediately on navigation start — BEFORE the new
        // page component renders. This prevents the "footer flash" where
        // the new page briefly appears at the old scroll position.
        if (this.isFirstNav) {
          // Don't touch scroll on the very first navigation (handled below)
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }

      // ── NavigationEnd / Cancel / Error ─────────────────
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Clear the delayed loader show
        if (this.loaderTimeout !== null) {
          window.clearTimeout(this.loaderTimeout);
          this.loaderTimeout = null;
        }
        this.isRouteLoading.set(false);

        // Handle first navigation (reload scroll restoration)
        if (this.isFirstNav) {
          this.isFirstNav = false;
          if (this.isReload) {
            const saved = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0);
            if (saved > 0) {
              requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'instant' }));
            }
          }
        }
      }
    });
  }

  hideLayout(): boolean {
    return this.router.url.startsWith('/review-submit');
  }

  /**
   * Fade out and remove the static HTML loader placed inside <app-root>
   * in index.html.
   */
  private dismissLoader(): void {
    const loader = document.getElementById('appLoader');
    if (!loader) return;

    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    setTimeout(() => {
      if (loader.parentNode) loader.remove();
    }, 600);
  }
}