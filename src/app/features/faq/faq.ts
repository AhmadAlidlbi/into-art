import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FAQS, FAQ_CATEGORIES, FaqItem } from './services/faq.data';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.scss'],
})
export class FaqPage {
  categories = FAQ_CATEGORIES;
  all: FaqItem[] = FAQS;

  selectedCategory = signal<string>('All');
  search = signal<string>('');
  openIndex = signal<number | null>(0);

  filtered = computed(() => {
    const cat = this.selectedCategory();
    const q = this.search().trim().toLowerCase();

    return this.all.filter((x) => {
      const matchCat = cat === 'All' ? true : x.category === cat;
      const matchQ =
        !q ||
        x.q.toLowerCase().includes(q) ||
        x.a.toLowerCase().includes(q) ||
        x.category.toLowerCase().includes(q);

      return matchCat && matchQ;
    });
  });

  constructor(private router: Router) {}

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.openIndex.set(null);
  }

  setSearch(v: string): void {
    this.search.set(v);
    this.openIndex.set(null);
  }

  resetFilters(): void {
    this.selectedCategory.set('All');
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
