import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class HomePage implements OnInit, OnDestroy {
  @Input() brandName = 'IntoArt';
  @Input() consultationPath = '/book-consultation';
  @Input() whatsappNumber = '96550000000';

  // Top 3 cards
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
  ];

  // Who we are metrics (make them real later)
  metrics = {
    years: '15+',
    team: '25+',
    clients: '500+',
  };

  // Procedure
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

  // Why choose us
  features: Feature[] = [
    {
      title: 'Design that reflects your lifestyle',
      desc: 'Concept-to-detail solutions tailored for modern living.',
    },
    {
      title: 'Transparent timelines and steps',
      desc: 'Clear phases and communication from consultation to handover.',
    },
    {
      title: 'Execution with attention to detail',
      desc: 'Site supervision and finishing quality you can trust.',
    },
  ];

  // Projects slider
  featuredProjects: ProjectCard[] = [
    {
      title: 'Modern Apartment Living Room',
      category: 'Apartment',
      image: 'assets/images/portfolio/projects/living.jpg',
      slug: 'modern-apartment-living-room',
    },
    {
      title: 'Warm Minimal Bedroom',
      category: 'Bedroom',
      image: 'assets/images/portfolio/projects/room.jpg',
      slug: 'warm-minimal-bedroom',
    },
    {
      title: 'Contemporary Villa Majlis',
      category: 'Villa',
      image: 'assets/images/portfolio/projects/living.jpg',
      slug: 'contemporary-villa-majlis',
    },
  ];

  projectIndex = 0;
  private projectTimer: number | null = null;

  nextProjects(): void {
    this.projectIndex = (this.projectIndex + 1) % this.featuredProjects.length;
  }

  prevProjects(): void {
    this.projectIndex =
      (this.projectIndex - 1 + this.featuredProjects.length) % this.featuredProjects.length;
  }

  // Reviews (continuous marquee)
  // NOTE: Reviews no longer use index-based slider. Using CSS continuous marquee (small cards auto-scroll).
  reviews: Review[] = [
    {
      name: 'Client A',
      role: 'Kuwait',
      text: 'Very structured process. Clear steps, great finishing, and fast responses.',
    },
    {
      name: 'Client B',
      role: 'Apartment Renovation',
      text: 'They understood our taste quickly and delivered exactly what we wanted.',
    },
    {
      name: 'Client C',
      role: 'Villa Interior',
      text: 'Professional team, clean timelines, and excellent material recommendations.',
    },
    {
      name: 'Client D',
      role: 'Majlis Design',
      text: 'High attention to detail and very smooth communication through all stages.',
    },
    {
      name: 'Client E',
      role: 'Full Renovation',
      text: 'Timeline was clear, material choices were premium, and the final result was perfect.',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ Auto-flip featured projects every 3 seconds
    this.projectTimer = window.setInterval(() => {
      this.nextProjects();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.projectTimer) window.clearInterval(this.projectTimer);
  }

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }

  openWhatsApp(): void {
    window.open(`https://wa.me/${this.whatsappNumber}`, '_blank', 'noopener,noreferrer');
  }
}
