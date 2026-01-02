// home.ts (FULL - updated)
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

type Feature = { title: string; desc: string };
type ProjectCard = { title: string; category: string; image: string; slug?: string };
type Review = { name: string; role: string; text: string };
type Card = { titleKey: string; descKey: string; path: string };
type Step = { title: string; desc: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @Input() consultationPath = '/book-consultation';

  // Enter animations
  heroEnter = signal(false);
  ctaEnter = signal(false);

  @ViewChild('ctaSection', { read: ElementRef })
  ctaSection?: ElementRef<HTMLElement>;
  private ctaIO?: IntersectionObserver;

  // WHO observer (observe the metrics grid)
  @ViewChild('whoMetrics', { read: ElementRef })
  whoMetrics?: ElementRef<HTMLElement>;
  private whoIO?: IntersectionObserver;
  private metricsAnimated = false;

  serviceCards: Card[] = [
    { titleKey: 'cards.card_1.title', descKey: 'cards.card_1.description', path: '/book-consultation' },
    { titleKey: 'cards.card_2.title', descKey: 'cards.card_2.description', path: '/under-construction' },
    { titleKey: 'cards.card_3.title', descKey: 'cards.card_3.description', path: '/under-construction' },
  ];

  metricsTarget = { years: 15, team: 25, clients: 500 };

  yearsDisplay = 0;
  teamDisplay = 0;
  clientsDisplay = 0;

  procedureSteps: Step[] = [
    {
      title: 'Client design consultation',
      desc: 'We understand your needs, style, and constraints to align direction early.',
    },
    {
      title: 'Concept + proposal',
      desc: 'We present layout, mood direction, and estimated scope before full detailing.',
    },
    {
      title: 'Execution + handover',
      desc: 'Site follow-up, finishing quality, and clear handover with final checks.',
    },
  ];

  features: Feature[] = [
    { title: 'Design that reflects your lifestyle', desc: 'Concept-to-detail solutions tailored for modern living.' },
    { title: 'Transparent timelines and steps', desc: 'Clear phases and communication from consultation to handover.' },
    { title: 'Execution with attention to detail', desc: 'Site supervision and finishing quality you can trust.' },
  ];

  featuredProjects: ProjectCard[] = [
    { title: 'Modern Apartment Living Room', category: 'Apartment', image: 'assets/images/portfolio/projects/living.jpg' },
    { title: 'Warm Minimal Bedroom', category: 'Bedroom', image: 'assets/images/portfolio/projects/room.jpg' },
    { title: 'Contemporary Villa Majlis', category: 'Villa', image: 'assets/images/portfolio/projects/living.jpg' },
  ];

  projectIndex = 0;
  private projectTimer: number | null = null;

  // Featured Projects swipe/drag
  projectsDragging = false;
  projectsDragPx = 0;

  private projectsStartX = 0;
  private projectsActivePointerId: number | null = null;
  private projectsMoved = false;

  // Reviews (auto-marquee only)
  reviews: Review[] = [
    { name: 'Client A', role: 'Kuwait', text: 'Very structured process. Clear steps, great finishing, and fast responses.' },
    { name: 'Client B', role: 'Apartment Renovation', text: 'They understood our taste quickly and delivered exactly what we wanted.' },
    { name: 'Client C', role: 'Villa Interior', text: 'Professional team, clean timelines, and excellent material recommendations.' },
    { name: 'Client D', role: 'Majlis Design', text: 'High attention to detail and very smooth communication through all stages.' },
    { name: 'Client E', role: 'Full Renovation', text: 'Timeline was clear, material choices were premium, and the final result was perfect.' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.projectTimer = window.setInterval(() => {
      if (!this.projectsDragging) this.nextProjects();
    }, 3000);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.heroEnter.set(true));

    // CTA animate on view
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

    // WHO metrics animate on view (75%)
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
    if (this.projectTimer) window.clearInterval(this.projectTimer);
    this.ctaIO?.disconnect();
    this.whoIO?.disconnect();
  }

  private animateWhoMetrics(): void {
    const start = performance.now();
    const duration = 1400;

    const yTarget = this.metricsTarget.years;
    const tTarget = this.metricsTarget.team;
    const cTarget = this.metricsTarget.clients;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      const e = easeOutCubic(p);

      this.yearsDisplay = Math.round(yTarget * e);
      this.teamDisplay = Math.round(tTarget * e);
      this.clientsDisplay = Math.round(cTarget * e);

      if (p < 1) requestAnimationFrame(tick);
      else {
        this.yearsDisplay = yTarget;
        this.teamDisplay = tTarget;
        this.clientsDisplay = cTarget;
      }
    };

    requestAnimationFrame(tick);
  }

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }

  nextProjects(): void {
    this.projectIndex = (this.projectIndex + 1) % this.featuredProjects.length;
  }

  prevProjects(): void {
    this.projectIndex =
      (this.projectIndex - 1 + this.featuredProjects.length) % this.featuredProjects.length;
  }

  // Featured Projects pointer handlers
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
