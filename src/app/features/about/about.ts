import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

type ValueCard = { title: string; desc: string; icon?: string };

type Step = {
  title: string;
  desc: string;
};

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  @Input() brandName = 'IntoArt';
  @Input() consultationPath = '/book-consultation';
  @Input() whatsappNumber = '96550000000';

  values: ValueCard[] = [
    {
      title: 'Design with purpose',
      desc: 'We prioritize comfort, flow, and long-term usability — not just aesthetics.',
    },
    {
      title: 'Execution that matches the design',
      desc: 'We focus on details, finishing, and site supervision to deliver the final look.',
    },
    {
      title: 'Clear communication',
      desc: 'Structured steps, timely updates, and transparent decisions.',
    },
  ];

  process: Step[] = [
    {
      title: 'Consultation',
      desc: 'We understand your needs, style, timeline, and space requirements.',
    },
    {
      title: 'Concept & Proposal',
      desc: 'We translate ideas into a concept and a clear direction.',
    },
    {
      title: 'Contract & Planning',
      desc: 'We define scope, timeline, and deliverables before execution starts.',
    },
    {
      title: 'Execution',
      desc: 'Our team coordinates site work and quality control throughout the project.',
    },
    {
      title: 'Handover',
      desc: 'Final inspection, finishing touches, and a clean handover experience.',
    },
  ];

  constructor(private router: Router) {}

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }

  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
