import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { CookieConsentComponent } from './shared/cookie-consent/cookie-consent';
import { WhatsappFloatComponent } from './shared/ui/whatsapp-float/whatsapp-float';
import { ScrollTopComponent } from "./shared/ui/scroll-top/scroll-top";

@Component({
  selector: 'app-root',
  standalone: true, // ✅ REQUIRED for imports[] to work reliably
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CookieConsentComponent,
    WhatsappFloatComponent,
    ScrollTopComponent
],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'], // ✅ plural (otherwise styles won't load)
})
export class App {
  protected readonly title = signal('into-art');
  isDrawerOpen = signal(false);
}
