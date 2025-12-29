import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

type ConsentState = 'unknown' | 'accepted' | 'rejected';
const KEY = 'intoart_cookie_consent_v1';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookie-consent.html',
  styleUrls: ['./cookie-consent.scss'],
})
export class CookieConsentComponent {
  state = signal<ConsentState>('unknown');

  visible = computed(() => this.state() === 'unknown');

  constructor() {
    const saved = (localStorage.getItem(KEY) as ConsentState | null) ?? 'unknown';
    this.state.set(saved);
  }

  accept(): void {
    this.state.set('accepted');
    localStorage.setItem(KEY, 'accepted');
    // Later: enable GA consent here
  }

  reject(): void {
    this.state.set('rejected');
    localStorage.setItem(KEY, 'rejected');
    // Later: keep GA disabled here
  }
}
