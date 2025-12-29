import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PROJECTS, PROJECT_CATEGORIES, Project } from '../projects/services/projects.data';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss'],
})
export class PortfolioPage {
  all: Project[] = PROJECTS;

  // reuse categories, but hide "All" in UI chips if you want
  categories = ['All', ...PROJECT_CATEGORIES.filter((c) => c !== 'All')];

  selectedCategory = signal<string>('All');
  search = signal<string>('');

  featured = computed(() => this.all.filter((p) => p.featured).slice(0, 3));

  filtered = computed(() => {
    const cat = this.selectedCategory();
    const q = this.search().trim().toLowerCase();

    return this.all.filter((p) => {
      const matchCat = cat === 'All' ? true : p.category === cat;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.area ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q);

      return matchCat && matchQ;
    });
  });

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  setSearch(v: string): void {
    this.search.set(v);
  }
}
