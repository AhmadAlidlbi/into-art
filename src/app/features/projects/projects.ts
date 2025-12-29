import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PROJECTS, PROJECT_CATEGORIES, Project } from './services/projects.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class ProjectsPage {
  categories = PROJECT_CATEGORIES;
  allProjects: Project[] = PROJECTS;

  selectedCategory = signal<string>('All');
  search = signal<string>('');

  filtered = computed(() => {
    const cat = this.selectedCategory();
    const q = this.search().trim().toLowerCase();
  
    return this.allProjects.filter((p) => {
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
