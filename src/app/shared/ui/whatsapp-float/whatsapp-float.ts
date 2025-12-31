import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-float.html',
  styleUrls: ['./whatsapp-float.scss'],
})
export class WhatsappFloatComponent {
  /** WhatsApp number without + (e.g., 96550000000) */
  @Input() number = '96566576673';

  /** Optional: prefilled message */
  @Input() message = '';

  /** Optional: show/hide */
  @Input() enabled = true;

  openWhatsApp(): void {
    if (!this.enabled) return;

    const base = `https://wa.me/${this.number}`;
    const msg = this.message?.trim();
    const url = msg ? `${base}?text=${encodeURIComponent(msg)}` : base;

    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
