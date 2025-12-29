import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BLOG_CATEGORIES, BLOG_POSTS, BlogPost } from './services/blog.data';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.html',
  styleUrls: ['./blog.scss'],
})
export class BlogPage {
  categories = BLOG_CATEGORIES;
  all: BlogPost[] = BLOG_POSTS;

  selectedCategory = signal<string>('All');
  search = signal<string>('');

  filtered = computed(() => {
    const cat = this.selectedCategory();
    const q = this.search().trim().toLowerCase();

    return this.all
      .filter((p) => {
        const matchCat = cat === 'All' ? true : p.category === cat;
        const matchQ =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.join(' ').toLowerCase().includes(q);

        return matchCat && matchQ;
      })
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  });

  newestDate = computed(() => {
    const newest = this.all
      .map((x) => x.publishedAt)
      .slice()
      .sort((a, b) => (a < b ? 1 : -1))[0];
    return this.formatDate(newest);
  });

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  setSearch(v: string): void {
    this.search.set(v);
  }

  reset(): void {
    this.selectedCategory.set('All');
    this.search.set('');
  }

  trackBySlug(_: number, p: BlogPost): string {
    return p.slug;
  }

  formatDate(iso: string): string {
    // Simple, safe formatting without external libs
    // ISO assumed: YYYY-MM-DD
    const [y, m, d] = iso.split('-').map((x) => Number(x));
    if (!y || !m || !d) return iso;
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }
}
