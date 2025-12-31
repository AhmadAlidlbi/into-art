import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-top.html',
  styleUrls: ['./scroll-top.scss'],
})
export class ScrollTopComponent {
  /** Show when user is close to bottom */
  @Input() bottomOffsetPx = 520;

  /** Optional: disable component */
  @Input() enabled = true;

  /** Internal visible flag */
  visible = false;

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.enabled) {
      this.visible = false;
      return;
    }

    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
    const viewport = window.innerHeight || doc.clientHeight || 0;
    const fullHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);

    const distanceFromBottom = fullHeight - (scrollTop + viewport);

    this.visible = distanceFromBottom <= this.bottomOffsetPx;
  }

  scrollToTop(): void {
    if (!this.enabled) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
