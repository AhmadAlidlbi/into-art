import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FAQS, FAQ_CATEGORIES, FaqItem } from './services/faq.data';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.scss'],
})
export class FaqPage implements AfterViewInit, OnDestroy {
  categories = FAQ_CATEGORIES;
  all: FaqItem[] = FAQS;

  selectedCategory = signal<string>('all');
  search = signal<string>('');
  openIndex = signal<number | null>(0);

  filtered = computed(() => {
    const cat = this.selectedCategory();
    const q = this.search().trim().toLowerCase();

    return this.all.filter((x) => {
      const matchCat = cat === 'all' ? true : x.category === cat;
      const matchQ =
        !q ||
        x.q.toLowerCase().includes(q) ||
        x.a.toLowerCase().includes(q) ||
        x.category.toLowerCase().includes(q);

      return matchCat && matchQ;
    });
  });

  ctaEnter = signal(false);

  @ViewChild('ctaSection', { read: ElementRef })
  ctaSection?: ElementRef<HTMLElement>;
  private ctaIO?: IntersectionObserver;

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
  }

  ngOnDestroy(): void {
    this.ctaIO?.disconnect();
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.openIndex.set(null);
  }

  setSearch(v: string): void {
    this.search.set(v);
    this.openIndex.set(null);
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.search.set('');
    this.openIndex.set(null);
  }

  toggle(i: number): void {
    this.openIndex.set(this.openIndex() === i ? null : i);
  }

  goBook(): void {
    this.router.navigateByUrl('/book-consultation');
  }

  openWhatsApp(): void {
    window.open(`https://wa.me/96550000000`, '_blank', 'noopener,noreferrer');
  }
}
