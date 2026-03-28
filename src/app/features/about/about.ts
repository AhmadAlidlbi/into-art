import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type ValueCard = { titleKey: string; descKey: string };

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements AfterViewInit, OnDestroy {
  @Input() brandName = 'IntoArt';
  @Input() consultationPath = '/book-consultation';
  @Input() whatsappNumber = '96550000000';

  values: ValueCard[] = [
    { titleKey: 'about.values.items.1.title', descKey: 'about.values.items.1.desc' },
    { titleKey: 'about.values.items.2.title', descKey: 'about.values.items.2.desc' },
    { titleKey: 'about.values.items.3.title', descKey: 'about.values.items.3.desc' },
  ];

  ctaEnter = signal(false);

  @ViewChild('ctaSection', { read: ElementRef })
  ctaSection?: ElementRef<HTMLElement>;
  private ctaIO?: IntersectionObserver;

  @ViewChild('whoMetrics', { read: ElementRef })
  whoMetrics?: ElementRef<HTMLElement>;
  private whoIO?: IntersectionObserver;
  private metricsAnimated = false;

  metricsTarget = { years: 15, team: 25, clients: 500 };
  yearsDisplay = 0;
  teamDisplay = 0;
  clientsDisplay = 0;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const ctaEl = this.ctaSection?.nativeElement;
    if (ctaEl) {
      this.ctaIO = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          this.ctaEnter.set(true);
          this.ctaIO?.disconnect();
          this.ctaIO = undefined;
        },
        { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
      );
      this.ctaIO.observe(ctaEl);
    }

    const metricsEl = this.whoMetrics?.nativeElement;
    if (metricsEl) {
      this.whoIO = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || this.metricsAnimated || !entry.isIntersecting) return;
          if (entry.intersectionRatio < 0.75) return;

          this.metricsAnimated = true;
          this.animateWhoMetrics();

          this.whoIO?.disconnect();
          this.whoIO = undefined;
        },
        { threshold: 0.75, rootMargin: '-8% 0px 0px 0px' }
      );
      this.whoIO.observe(metricsEl);
    }
  }

  ngOnDestroy(): void {
    this.ctaIO?.disconnect();
    this.whoIO?.disconnect();
  }

  private animateWhoMetrics(): void {
    const start = performance.now();
    const duration = 1400;
    const { years, team, clients } = this.metricsTarget;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const e = easeOut(p);

      this.yearsDisplay = Math.round(years * e);
      this.teamDisplay = Math.round(team * e);
      this.clientsDisplay = Math.round(clients * e);

      if (p < 1) requestAnimationFrame(tick);
      else {
        this.yearsDisplay = years;
        this.teamDisplay = team;
        this.clientsDisplay = clients;
      }
    };

    requestAnimationFrame(tick);
  }

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }

  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}