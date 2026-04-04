import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SERVICES, Service } from '../../services/services.data';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './service-details.html',
  styleUrls: ['./service-details.scss'],
})
export class ServiceDetailsPage implements AfterViewInit {
  private readonly doc = inject(DOCUMENT);
  private readonly slug = signal<string>('');

  @ViewChild('galleryTrack', { static: false })
  galleryTrack?: ElementRef<HTMLElement>;

  private readonly galleryStep = 294;
  private initialised = false;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.slug.set(params.get('slug') ?? '');
    });
  }

  service = computed<Service | null>(() => {
    const currentSlug = this.slug();
    return SERVICES.find((item) => item.slug === currentSlug) ?? null;
  });

  aboutKey = computed(() => {
    const current = this.service();
    return current?.aboutKey ?? current?.shortKey ?? null;
  });

  benefits = computed(() => this.service()?.bulletsKeys ?? []);

  faqsPreview = computed(() => {
    const current = this.service();
    return current?.faqs?.slice(0, 4) ?? [];
  });

  faqLink = computed(() => ['/faq']);

  galleryImages = computed<string[]>(() => {
    const current = this.service();
    if (!current) return [];

    const images = current.galleryImages ?? [];
    const fallback = current.heroImage ? [current.heroImage] : [];

    return Array.from(new Set([...images, ...fallback].filter(Boolean)));
  });

  loopedTrackImages = computed<string[]>(() => {
    const images = this.galleryImages();
    if (!images.length) return [];
    return [...images, ...images, ...images];
  });

  get isRtl(): boolean {
    return (this.doc?.documentElement?.getAttribute('dir') || 'ltr') === 'rtl';
  }

  ngAfterViewInit(): void {
    effect(() => {
      const images = this.loopedTrackImages();
      if (!images.length) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = this.galleryTrack?.nativeElement;
          if (!el) return;

          el.scrollLeft = 0;
          this.centerGalleryToMiddleCopy(true);
        });
      });
    });
  }

  scrollGallery(direction: 'prev' | 'next'): void {
    const el = this.galleryTrack?.nativeElement;
    const baseImages = this.galleryImages();

    if (!el || !baseImages.length) return;

    const delta = direction === 'next' ? this.galleryStep : -this.galleryStep;
    el.scrollBy({ left: delta, behavior: 'smooth' });

    window.setTimeout(() => this.normalizeGalleryLoop(), 260);
  }

  private centerGalleryToMiddleCopy(instant: boolean): void {
    const el = this.galleryTrack?.nativeElement;
    const baseImages = this.galleryImages();

    if (!el || !baseImages.length) return;

    const oneCopyWidth = this.getOneCopyWidth(el, baseImages.length);
    this.scrollToLeft(el, oneCopyWidth, instant);
    this.initialised = true;
  }

  private normalizeGalleryLoop(): void {
    const el = this.galleryTrack?.nativeElement;
    const baseImages = this.galleryImages();

    if (!el || !baseImages.length || !this.initialised) return;

    const oneCopyWidth = this.getOneCopyWidth(el, baseImages.length);
    const left = el.scrollLeft;
    const min = oneCopyWidth * 0.5;
    const max = oneCopyWidth * 2.5;

    if (left < min) {
      this.scrollToLeft(el, left + oneCopyWidth, true);
    } else if (left > max) {
      this.scrollToLeft(el, left - oneCopyWidth, true);
    }
  }

  private getOneCopyWidth(el: HTMLElement, baseCount: number): number {
    const one = el.scrollWidth / 3;
    return Number.isFinite(one) && one > 0 ? one : baseCount * this.galleryStep;
  }

  private scrollToLeft(el: HTMLElement, left: number, instant: boolean): void {
    el.scrollTo({
      left,
      behavior: instant ? 'auto' : 'smooth',
    });
  }
}