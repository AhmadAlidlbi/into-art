import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { WhatsappFloatComponent } from './shared/ui/whatsapp-float/whatsapp-float';
import { ScrollTopComponent } from './shared/ui/scroll-top/scroll-top';
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
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  isDrawerOpen = signal(false);

  readonly whatsappNumber = WHATSAPP_NUMBER;

  /** Reactively re-translates whenever the language changes. */
  readonly whatsappMessage = toSignal(this.translate.stream(WHATSAPP_MESSAGE_KEY), {
    initialValue: this.translate.instant(WHATSAPP_MESSAGE_KEY),
  });

  private isFirstNav = true;
  private readonly isReload =
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      ?.type === 'reload';

  constructor() {}

  ngOnInit(): void {
    // ─── Dismiss the app loader ──────────────────────────
    this.dismissLoader();

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

  /**
   * Fade out and remove the static HTML loader placed inside <app-root>
   * in index.html. Angular replaces the inner content on bootstrap,
   * but the loader element may still exist briefly in the DOM if Angular
   * hasn't fully painted yet — this ensures a smooth transition.
   */
  private dismissLoader(): void {
    const loader = document.getElementById('appLoader');
    if (!loader) return;

    // Add the fade-out class
    loader.classList.add('is-hidden');

    // Remove from DOM after the CSS transition completes
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });

    // Safety fallback: remove after 600ms even if transitionend doesn't fire
    setTimeout(() => {
      if (loader.parentNode) loader.remove();
    }, 600);
  }
}
