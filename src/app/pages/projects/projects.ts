import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PROJECTS, PROJECT_CATEGORIES, Project } from './services/projects.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class ProjectsPage implements AfterViewInit, OnDestroy {
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

  goBook(): void {
    this.router.navigateByUrl('/book-consultation');
  }

  categories = PROJECT_CATEGORIES;
  allProjects: Project[] = PROJECTS;

  selectedCategory = signal<string>('All');
  search = signal<string>('');

  filtered = computed(() => {
    const cat = this.selectedCategory();
    const q = this.search().trim().toLowerCase();
  
    return this.allProjects.filter((p) => {
      const matchCat = cat === 'All' ? true : p.categoryKey  === cat;
      const matchQ =
        !q ||
        p.titleKey.toLowerCase().includes(q) ||
        (p.area ?? '').toLowerCase().includes(q) ||
        (p.categoryKey  ?? '').toLowerCase().includes(q);
  
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
