import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { COMPANY_METRICS } from '../../shared/constants/company.constants';

type Differentiator = {
  icon: string;
  titleKey: string;
  descKey: string;
};

type TrustStat = {
  value: string;
  labelKey: string;
};

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements AfterViewInit, OnDestroy {
  @Input() consultationPath = '/book-consultation';

  differentiators: Differentiator[] = [
    { icon: '⌂', titleKey: 'about.different.items.1.title', descKey: 'about.different.items.1.desc' },
    { icon: '⇆', titleKey: 'about.different.items.2.title', descKey: 'about.different.items.2.desc' },
    { icon: '✓', titleKey: 'about.different.items.3.title', descKey: 'about.different.items.3.desc' },
    { icon: '◌', titleKey: 'about.different.items.4.title', descKey: 'about.different.items.4.desc' },
    { icon: '◎', titleKey: 'about.different.items.5.title', descKey: 'about.different.items.5.desc' },
    { icon: '✦', titleKey: 'about.different.items.6.title', descKey: 'about.different.items.6.desc' },
  ];

  trustStats: TrustStat[] = [
    { value: `${COMPANY_METRICS.years}+`, labelKey: 'about.trust.stats.1.label' },
    { value: `${COMPANY_METRICS.designProjects}+`, labelKey: 'about.trust.stats.2.label' },
    { value: `${COMPANY_METRICS.executionProjects}+`, labelKey: 'about.trust.stats.3.label' },
  ];

  ctaEnter = signal(false);

  @ViewChild('ctaSection', { read: ElementRef })
  ctaSection?: ElementRef<HTMLElement>;

  private ctaIO?: IntersectionObserver;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const ctaEl = this.ctaSection?.nativeElement;

    if (!ctaEl) return;

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

  ngOnDestroy(): void {
    this.ctaIO?.disconnect();
  }

  goBook(): void {
    this.router.navigateByUrl(this.consultationPath);
  }
}