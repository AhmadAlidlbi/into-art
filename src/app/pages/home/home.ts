import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FEATURED_PROJECTS } from './featured-projects.data';
import { REVIEWS } from './reviews.data';
import { COMPANY_METRICS } from '../../shared/constants/company.constants';

type Feature = { titleKey: string; descKey: string };
type Card = { titleKey: string; descKey: string; path: string };
type Step = { titleKey: string; descKey: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @Input() consultationPath = '/book-consultation';

  whoMediaImage = 'assets/images/HomePage/WhoAreWe/Reception-Top-View.webp';

  heroEnter = signal(false);
  ctaEnter = signal(false);

  @ViewChild('ctaSection', { read: ElementRef })
  ctaSection?: ElementRef<HTMLElement>;
  private ctaIO?: IntersectionObserver;

  @ViewChild('whoMetrics', { read: ElementRef })
  whoMetrics?: ElementRef<HTMLElement>;
  private whoIO?: IntersectionObserver;
  private metricsAnimated = false;

  serviceCards: Card[] = [
    {
      titleKey: 'cards.card_1.title',
      descKey: 'cards.card_1.description',
      path: '/book-consultation',
    },
    {
      titleKey: 'cards.card_2.title',
      descKey: 'cards.card_2.description',
      path: '/',
    },
    {
      titleKey: 'cards.card_3.title',
      descKey: 'cards.card_3.description',
      path: '/',
    },
    {
      titleKey: 'cards.card_4.title',
      descKey: 'cards.card_4.description',
      path: '/',
    },
  ];

  procedureSteps: Step[] = [
    { titleKey: 'home.procedure.steps.1.title', descKey: 'home.procedure.steps.1.desc' },
    { titleKey: 'home.procedure.steps.2.title', descKey: 'home.procedure.steps.2.desc' },
    { titleKey: 'home.procedure.steps.3.title', descKey: 'home.procedure.steps.3.desc' },
    { titleKey: 'home.procedure.steps.4.title', descKey: 'home.procedure.steps.4.desc' },
    { titleKey: 'home.procedure.steps.5.title', descKey: 'home.procedure.steps.5.desc' },
    { titleKey: 'home.procedure.steps.6.title', descKey: 'home.procedure.steps.6.desc' },
    { titleKey: 'home.procedure.steps.7.title', descKey: 'home.procedure.steps.7.desc' },
  ];

  metricsTarget = COMPANY_METRICS;

  yearsDisplay = 0;
  designProjectsDisplay = 0;
  executionProjectsDisplay = 0;

  features: Feature[] = [
    { titleKey: 'home.why.items.1.title', descKey: 'home.why.items.1.desc' },
    { titleKey: 'home.why.items.2.title', descKey: 'home.why.items.2.desc' },
    { titleKey: 'home.why.items.3.title', descKey: 'home.why.items.3.desc' },
  ];

  heroImages: string[] = [
    'assets/images/HomePage/Hero/Entrance-Foyer.webp',
    'assets/images/HomePage/Hero/Reception-Zoon-In-Shot.webp',
  ];

  heroIndex = 0;
  private heroTimer: number | null = null;

  featuredProjects = FEATURED_PROJECTS;

  projectIndex = 0;
  private projectTimer: number | null = null;

  projectsDragging = false;
  projectsDragPx = 0;
  projectsArrowBusy = false;

  private projectsStartX = 0;
  private projectsActivePointerId: number | null = null;
  private projectsMoved = false;
  private projectsArrowTimer: ReturnType<typeof setTimeout> | null = null;

  // ─── Reviews marquee ─────────────────────────────────────
  reviews = REVIEWS;
  reviewsDoubled = [...REVIEWS, ...REVIEWS];

  @ViewChild('reviewsTrack', { read: ElementRef })
  private reviewsTrackRef?: ElementRef<HTMLElement>;

  private reviewsRafId = 0;
  private reviewsOffset = 0;
  private reviewsSetWidth = 0;
  private reviewsDragging = false;
  private reviewsDragStartX = 0;
  private reviewsDragStartOffset = 0;
  private reviewsActivePtr: number | null = null;

  /** px moved per animation frame (~27 px/s at 60 fps) */
  private readonly REVIEWS_SPEED = 0.45;

  private readonly reviewsTick = (): void => {
    if (!this.reviewsDragging && this.reviewsSetWidth > 0) {
      const isRTL = document.documentElement.dir === 'rtl';
      this.reviewsOffset += isRTL ? this.REVIEWS_SPEED : -this.REVIEWS_SPEED;

      // Seamless wrap-around
      if (!isRTL && this.reviewsOffset <= -this.reviewsSetWidth) {
        this.reviewsOffset += this.reviewsSetWidth;
      } else if (isRTL && this.reviewsOffset >= 0) {
        this.reviewsOffset -= this.reviewsSetWidth;
      }

      this.applyReviewsTransform();
    }
    this.reviewsRafId = requestAnimationFrame(this.reviewsTick);
  };

  private applyReviewsTransform(): void {
    const el = this.reviewsTrackRef?.nativeElement;
    if (el) el.style.transform = `translateX(${this.reviewsOffset}px)`;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.heroTimer = window.setInterval(() => {
      this.nextHero();
    }, 4000);

    this.projectTimer = window.setInterval(() => {
      if (!this.projectsDragging) this.nextProjects();
    }, 3000);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.heroEnter.set(true);
    });

    const ctaEl = this.ctaSection?.nativeElement;
    if (ctaEl) {
      this.ctaIO = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          this.ctaEnter.set(true);
          this.ctaIO?.disconnect();
          this.ctaIO = undefined;
        },
        { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
      );
      this.ctaIO.observe(ctaEl);
    }

    const target = this.whoMetrics?.nativeElement;
    if (target) {
      this.whoIO = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || this.metricsAnimated) return;
          if (!entry.isIntersecting) return;
          if (entry.intersectionRatio < 0.75) return;
          this.metricsAnimated = true;
          this.animateWhoMetrics();
          this.whoIO?.disconnect();
          this.whoIO = undefined;
        },
        { threshold: 0.75, rootMargin: '-8% 0px 0px 0px' }
      );
      this.whoIO.observe(target);
    }

    // Init reviews marquee after layout is painted
    requestAnimationFrame(() => {
      const trackEl = this.reviewsTrackRef?.nativeElement;
      if (trackEl) {
        this.reviewsSetWidth = trackEl.scrollWidth / 2;
        if (document.documentElement.dir === 'rtl') {
          this.reviewsOffset = -this.reviewsSetWidth;
        }
        this.reviewsRafId = requestAnimationFrame(this.reviewsTick);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.heroTimer) window.clearInterval(this.heroTimer);
    if (this.projectTimer) window.clearInterval(this.projectTimer);
    this.ctaIO?.disconnect();
    this.whoIO?.disconnect();
    cancelAnimationFrame(this.reviewsRafId);
  }

  private animateWhoMetrics(): void {
    const start = performance.now();
    const duration = 1400;
    const yTarget = this.metricsTarget.years;
    const dTarget = this.metricsTarget.designProjects;
    const eTarget = this.metricsTarget.executionProjects;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(p);
      this.yearsDisplay = Math.round(yTarget * eased);
      this.designProjectsDisplay = Math.round(dTarget * eased);
      this.executionProjectsDisplay = Math.round(eTarget * eased);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        this.yearsDisplay = yTarget;
        this.designProjectsDisplay = dTarget;
        this.executionProjectsDisplay = eTarget;
      }
    };

    requestAnimationFrame(tick);
  }

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }

  nextHero(): void {
    this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
  }

  nextProjects(): void {
    if (!this.featuredProjects.length) return;
    this.projectIndex = (this.projectIndex + 1) % this.featuredProjects.length;
  }

  prevProjects(): void {
    if (!this.featuredProjects.length) return;
    this.projectIndex =
      (this.projectIndex - 1 + this.featuredProjects.length) % this.featuredProjects.length;
  }

  private resetProjectTimer(): void {
    if (this.projectTimer) {
      window.clearInterval(this.projectTimer);
    }
    this.projectTimer = window.setInterval(() => {
      if (!this.projectsDragging) this.nextProjects();
    }, 3000);
  }

  arrowNext(): void {
    if (this.projectsArrowBusy) return;
    this.nextProjects();
    this.projectsArrowBusy = true;
    this.resetProjectTimer();
    this.projectsArrowTimer = setTimeout(() => (this.projectsArrowBusy = false), 800);
  }

  arrowPrev(): void {
    if (this.projectsArrowBusy) return;
    this.prevProjects();
    this.projectsArrowBusy = true;
    this.resetProjectTimer();
    this.projectsArrowTimer = setTimeout(() => (this.projectsArrowBusy = false), 800);
  }

  projectsPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    if (this.projectTimer) {
      window.clearInterval(this.projectTimer);
      this.projectTimer = null;
    }

    this.projectsDragging = true;
    this.projectsMoved = false;
    this.projectsDragPx = 0;
    this.projectsStartX = e.clientX;
    this.projectsActivePointerId = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  projectsPointerMove(e: PointerEvent): void {
    if (!this.projectsDragging || this.projectsActivePointerId !== e.pointerId) return;

    const dx = e.clientX - this.projectsStartX;
    if (Math.abs(dx) > 6) this.projectsMoved = true;
    this.projectsDragPx = dx;
  }

  projectsPointerUp(e: PointerEvent): void {
    if (!this.projectsDragging || this.projectsActivePointerId !== e.pointerId) return;

    this.projectsDragging = false;
    this.projectsActivePointerId = null;

    const dx = this.projectsDragPx;
    this.projectsDragPx = 0;

    if (this.projectsMoved) {
      const threshold = 60;
      if (dx <= -threshold) this.nextProjects();
      else if (dx >= threshold) this.prevProjects();
    }

    if (this.projectTimer) window.clearInterval(this.projectTimer);
    this.projectTimer = window.setInterval(() => {
      if (!this.projectsDragging) this.nextProjects();
    }, 3000);
  }

  // ─── Reviews pointer handlers ─────────────────────────────
  reviewsPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.reviewsDragging = true;
    this.reviewsDragStartX = e.clientX;
    this.reviewsDragStartOffset = this.reviewsOffset;
    this.reviewsActivePtr = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  reviewsPointerMove(e: PointerEvent): void {
    if (!this.reviewsDragging || this.reviewsActivePtr !== e.pointerId) return;
    let newOffset = this.reviewsDragStartOffset + (e.clientX - this.reviewsDragStartX);
    // Keep offset within the valid looping range
    if (this.reviewsSetWidth > 0) {
      while (newOffset < -this.reviewsSetWidth) newOffset += this.reviewsSetWidth;
      while (newOffset > 0) newOffset -= this.reviewsSetWidth;
    }
    this.reviewsOffset = newOffset;
    this.applyReviewsTransform();
  }

  reviewsPointerUp(e: PointerEvent): void {
    if (this.reviewsActivePtr !== e.pointerId) return;
    this.reviewsDragging = false;
    this.reviewsActivePtr = null;
  }
}
