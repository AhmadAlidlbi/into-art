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

type Feature = { titleKey: string; descKey: string };
type ProjectCard = { titleKey: string; categoryKey: string; image: string; slug?: string };
type Review = { nameKey: string; roleKey: string; textKey: string };
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
      path: '/under-construction',
    },
    {
      titleKey: 'cards.card_3.title',
      descKey: 'cards.card_3.description',
      path: '/under-construction',
    },
    {
      titleKey: 'cards.card_4.title',
      descKey: 'cards.card_4.description',
      path: '/under-construction',
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

  metricsTarget = { years: 6, designProjects: 200, executionProjects: 50 };

  yearsDisplay = 0;
  designProjectsDisplay = 0;
  executionProjectsDisplay = 0;

  features: Feature[] = [
    { titleKey: 'home.why.items.1.title', descKey: 'home.why.items.1.desc' },
    { titleKey: 'home.why.items.2.title', descKey: 'home.why.items.2.desc' },
    { titleKey: 'home.why.items.3.title', descKey: 'home.why.items.3.desc' },
  ];

  heroImages: string[] = [
    'assets/images/portfolio/projects/living.jpg',
    'assets/images/portfolio/projects/room.jpg',
  ];

  heroIndex = 0;
  heroDragging = false;
  heroDragPx = 0;
  private heroStartX = 0;
  private heroActivePointerId: number | null = null;
  private heroMoved = false;
  private heroTimer: number | null = null;

  featuredProjects: ProjectCard[] = [
    {
      titleKey: 'home.featured.items.1.title',
      categoryKey: 'home.featured.items.1.category',
      image: 'assets/images/portfolio/projects/living.jpg',
      slug: 'modern-apartment-living-room',
    },
    {
      titleKey: 'home.featured.items.2.title',
      categoryKey: 'home.featured.items.2.category',
      image: 'assets/images/portfolio/projects/room.jpg',
      slug: 'warm-minimal-bedroom',
    },
    {
      titleKey: 'home.featured.items.3.title',
      categoryKey: 'home.featured.items.3.category',
      image: 'assets/images/portfolio/projects/living.jpg',
      slug: 'contemporary-villa-majlis',
    },
  ];

  projectIndex = 0;
  private projectTimer: number | null = null;

  projectsDragging = false;
  projectsDragPx = 0;

  private projectsStartX = 0;
  private projectsActivePointerId: number | null = null;
  private projectsMoved = false;

  reviews: Review[] = [
    {
      nameKey: 'home.reviews.items.1.name',
      roleKey: 'home.reviews.items.1.role',
      textKey: 'home.reviews.items.1.text',
    },
    {
      nameKey: 'home.reviews.items.2.name',
      roleKey: 'home.reviews.items.2.role',
      textKey: 'home.reviews.items.2.text',
    },
    {
      nameKey: 'home.reviews.items.3.name',
      roleKey: 'home.reviews.items.3.role',
      textKey: 'home.reviews.items.3.text',
    },
    {
      nameKey: 'home.reviews.items.4.name',
      roleKey: 'home.reviews.items.4.role',
      textKey: 'home.reviews.items.4.text',
    },
    {
      nameKey: 'home.reviews.items.5.name',
      roleKey: 'home.reviews.items.5.role',
      textKey: 'home.reviews.items.5.text',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.heroTimer = window.setInterval(() => {
      if (!this.heroDragging) this.nextHero();
    }, 4000);

    this.projectTimer = window.setInterval(() => {
      if (!this.projectsDragging) this.nextProjects();
    }, 3000);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.heroEnter.set(true));

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
        {
          threshold: 0.75,
          rootMargin: '-8% 0px 0px 0px',
        }
      );

      this.whoIO.observe(target);
    }
  }

  ngOnDestroy(): void {
    if (this.heroTimer) window.clearInterval(this.heroTimer);
    if (this.projectTimer) window.clearInterval(this.projectTimer);
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

  nextHero(): void {
    this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
  }

  prevHero(): void {
    this.heroIndex = (this.heroIndex - 1 + this.heroImages.length) % this.heroImages.length;
  }

  heroPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.heroDragging = true;
    this.heroMoved = false;
    this.heroDragPx = 0;
    this.heroStartX = e.clientX;
    this.heroActivePointerId = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  heroPointerMove(e: PointerEvent) {
    if (!this.heroDragging || this.heroActivePointerId !== e.pointerId) return;
    const dx = e.clientX - this.heroStartX;
    if (Math.abs(dx) > 6) this.heroMoved = true;
    this.heroDragPx = dx;
  }

  heroPointerUp(e: PointerEvent) {
    if (!this.heroDragging || this.heroActivePointerId !== e.pointerId) return;
    this.heroDragging = false;
    this.heroActivePointerId = null;
    const dx = this.heroDragPx;
    this.heroDragPx = 0;
    if (!this.heroMoved) return;
    const isRtl = document.documentElement.dir === 'rtl';
    const threshold = 60;
    const effectiveDx = isRtl ? -dx : dx;
    if (effectiveDx <= -threshold) this.nextHero();
    else if (effectiveDx >= threshold) this.prevHero();
  }

  nextProjects(): void {
    this.projectIndex = (this.projectIndex + 1) % this.featuredProjects.length;
  }

  prevProjects(): void {
    this.projectIndex =
      (this.projectIndex - 1 + this.featuredProjects.length) % this.featuredProjects.length;
  }

  projectsPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    this.projectsDragging = true;
    this.projectsMoved = false;
    this.projectsDragPx = 0;

    this.projectsStartX = e.clientX;
    this.projectsActivePointerId = e.pointerId;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  projectsPointerMove(e: PointerEvent) {
    if (!this.projectsDragging || this.projectsActivePointerId !== e.pointerId) return;

    const dx = e.clientX - this.projectsStartX;
    if (Math.abs(dx) > 6) this.projectsMoved = true;

    this.projectsDragPx = dx;
  }

  projectsPointerUp(e: PointerEvent) {
    if (!this.projectsDragging || this.projectsActivePointerId !== e.pointerId) return;

    this.projectsDragging = false;
    this.projectsActivePointerId = null;

    const dx = this.projectsDragPx;
    this.projectsDragPx = 0;

    if (!this.projectsMoved) return;

    const threshold = 60;
    if (dx <= -threshold) this.nextProjects();
    else if (dx >= threshold) this.prevProjects();
  }
}
