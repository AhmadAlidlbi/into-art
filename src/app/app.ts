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
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { WhatsappFloatComponent } from './shared/ui/whatsapp-float/whatsapp-float';
import { ScrollTopComponent } from './shared/ui/scroll-top/scroll-top';
import { RouteLoaderComponent } from './shared/ui/route-loader/route-loader';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE_KEY } from './shared/constants/whatsapp.constants';

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

  readonly whatsappMessage = toSignal(
    this.translate.stream(WHATSAPP_MESSAGE_KEY),
    { initialValue: this.translate.instant(WHATSAPP_MESSAGE_KEY) }
  );

  private loaderTimeout: number | null = null;

  constructor() {}

  ngOnInit(): void {
    // ─── Dismiss the initial app loader ──────────────────
    this.dismissLoader();

    // ─── Route loading indicator ─────────────────────────
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loaderTimeout = window.setTimeout(() => {
          this.isRouteLoading.set(true);
        }, 120);
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (this.loaderTimeout !== null) {
          window.clearTimeout(this.loaderTimeout);
          this.loaderTimeout = null;
        }
        this.isRouteLoading.set(false);
      }
    });
  }

  hideLayout(): boolean {
    return this.router.url.startsWith('/review-submit');
  }

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