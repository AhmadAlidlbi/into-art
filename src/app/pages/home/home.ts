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
import { REVIEWS, ReviewItem } from './reviews.data';
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

  @ViewChild('reviewsTrack', { read: ElementRef })
  reviewsTrackRef?: ElementRef<HTMLElement>;

  private reviewsX = 0;
  private reviewsVel = 0;
  private reviewsDragging = false;
  private reviewsHalfW = 0;
  private reviewsAutoSpeed = -0.5;
  private reviewsRafId = 0;
  private reviewsDragStartX = 0;
  private reviewsDragBaseX = 0;
  private reviewsDragSamples: { x: number; t: number }[] = [];
  private reviewsActivePtr: number | null = null;
  private reviewsInitialised = false;
  private reviewsResizeObserver?: ResizeObserver;
  private reviewsResetTimeout: number | null = null;

  private readonly handleReviewsResize = () => {
    this.resetReviewsMarquee();
  };

  private readonly handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.resetReviewsMarquee();
    }
  };

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

  private projectsStartX = 0;
  private projectsActivePointerId: number | null = null;
  private projectsMoved = false;

  reviews: ReviewItem[] = REVIEWS;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.heroTimer = window.setInterval(() => {
      this.nextHero();
    }, 4000);

    if (this.featuredProjects.length > 1) {
      this.projectTimer = window.setInterval(() => {
        if (!this.projectsDragging) this.nextProjects();
      }, 3000);
    }
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.heroEnter.set(true);
      this.initReviewsMarquee();
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

    const reviewsEl = this.reviewsTrackRef?.nativeElement;
    if (reviewsEl) {
      this.reviewsResizeObserver = new ResizeObserver(() => {
        this.resetReviewsMarquee();
      });
      this.reviewsResizeObserver.observe(reviewsEl);
    }

    window.addEventListener('resize', this.handleReviewsResize, { passive: true });
    window.addEventListener('orientationchange', this.handleReviewsResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) window.clearInterval(this.heroTimer);
    if (this.projectTimer) window.clearInterval(this.projectTimer);
    if (this.reviewsRafId) cancelAnimationFrame(this.reviewsRafId);
    if (this.reviewsResetTimeout) window.clearTimeout(this.reviewsResetTimeout);

    this.reviewsResizeObserver?.disconnect();
    window.removeEventListener('resize', this.handleReviewsResize);
    window.removeEventListener('orientationchange', this.handleReviewsResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    this.ctaIO?.disconnect();
    this.whoIO?.disconnect();
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

  private initReviewsMarquee(): void {
    const el = this.reviewsTrackRef?.nativeElement;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isRtl = document.documentElement.dir === 'rtl';

    const doInit = () => {
      const currentEl = this.reviewsTrackRef?.nativeElement;
      if (!currentEl) return;

      const sw = currentEl.scrollWidth;

      if (sw < 200) {
        this.reviewsResetTimeout = window.setTimeout(doInit, 100);
        return;
      }

      this.reviewsHalfW = sw / 2 + 7;

      if (isRtl) {
        this.reviewsAutoSpeed = 0.5;
        this.reviewsX = -this.reviewsHalfW;
      } else {
        this.reviewsAutoSpeed = -0.5;
        this.reviewsX = 0;
      }

      this.reviewsVel = 0;
      this.reviewsInitialised = true;
      currentEl.style.transform = `translate3d(${this.reviewsX}px, 0, 0)`;

      if (!this.reviewsRafId) {
        this.reviewsLoop();
      }
    };

    doInit();
  }

  private resetReviewsMarquee(): void {
    const el = this.reviewsTrackRef?.nativeElement;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.reviewsInitialised = false;
    this.reviewsVel = 0;
    this.reviewsDragging = false;

    if (this.reviewsRafId) {
      cancelAnimationFrame(this.reviewsRafId);
      this.reviewsRafId = 0;
    }

    if (this.reviewsResetTimeout) {
      window.clearTimeout(this.reviewsResetTimeout);
      this.reviewsResetTimeout = null;
    }

    el.style.transform = 'translate3d(0, 0, 0)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initReviewsMarquee();
      });
    });
  }

  private reviewsLoop(): void {
    this.reviewsRafId = requestAnimationFrame(() => this.reviewsLoop());

    const el = this.reviewsTrackRef?.nativeElement;
    if (!el || !this.reviewsInitialised || this.reviewsHalfW === 0) return;

    if (!this.reviewsDragging) {
      if (Math.abs(this.reviewsVel) > 0.2) {
        this.reviewsX += this.reviewsVel;
        this.reviewsVel *= 0.94;
        if (Math.abs(this.reviewsVel) < 0.2) this.reviewsVel = 0;
      } else {
        this.reviewsVel = 0;
        this.reviewsX += this.reviewsAutoSpeed;
      }
    }

    const hw = this.reviewsHalfW;

    if (this.reviewsX <= -hw) this.reviewsX += hw;
    if (this.reviewsX > 0) this.reviewsX -= hw;

    el.style.transform = `translate3d(${this.reviewsX}px, 0, 0)`;
  }

  reviewsPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!this.reviewsInitialised) return;

    this.reviewsDragging = true;
    this.reviewsVel = 0;
    this.reviewsDragStartX = e.clientX;
    this.reviewsDragBaseX = this.reviewsX;
    this.reviewsDragSamples = [{ x: e.clientX, t: Date.now() }];
    this.reviewsActivePtr = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  reviewsPointerMove(e: PointerEvent): void {
    if (!this.reviewsDragging || this.reviewsActivePtr !== e.pointerId) return;

    const dx = e.clientX - this.reviewsDragStartX;
    this.reviewsX = this.reviewsDragBaseX + dx;
    this.reviewsDragSamples.push({ x: e.clientX, t: Date.now() });

    if (this.reviewsDragSamples.length > 6) {
      this.reviewsDragSamples.shift();
    }
  }

  reviewsPointerUp(e: PointerEvent): void {
    if (!this.reviewsDragging || this.reviewsActivePtr !== e.pointerId) return;

    this.reviewsDragging = false;
    this.reviewsActivePtr = null;

    const s = this.reviewsDragSamples;
    if (s.length >= 2) {
      const dt = s[s.length - 1].t - s[0].t;
      const dx = s[s.length - 1].x - s[0].x;
      if (dt > 0 && dt < 200) {
        this.reviewsVel = Math.max(-28, Math.min(28, (dx / dt) * 16));
      }
    }

    this.reviewsDragSamples = [];
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

    if (this.featuredProjects.length > 1) {
      this.projectTimer = window.setInterval(() => {
        if (!this.projectsDragging) this.nextProjects();
      }, 3000);
    }
  }
}
