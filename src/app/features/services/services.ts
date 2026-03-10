import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SERVICES, Service, ServiceCategory } from './services/services.data';

type ProcedureStep = {
  titleKey: string;
  descKey: string;
};

type CategoryFilter = 'all' | ServiceCategory;

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss'],
})
export class ServicesPage {
  @Input() brandName = 'IntoArt';

  private readonly staticServices: Service[] = SERVICES;

  services = computed(() =>
    this.staticServices
      .filter((s) => s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );

  topSix = computed(() => this.services().slice(0, 6));

  procedureSteps: ProcedureStep[] = [
    { titleKey: 'services.procedure.1.title', descKey: 'services.procedure.1.desc' },
    { titleKey: 'services.procedure.2.title', descKey: 'services.procedure.2.desc' },
    { titleKey: 'services.procedure.3.title', descKey: 'services.procedure.3.desc' },
  ];

  procedureImage = 'assets/images/services/procedure.webp';

  selectedCategory = signal<CategoryFilter>('all');
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);

  readonly pageSize = 3;

  categoryFilters: { value: CategoryFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'services.catalog.filters.all' },
    { value: 'residential', labelKey: 'services.catalog.filters.residential' },
    { value: 'renovation', labelKey: 'services.catalog.filters.renovation' },
    { value: 'fitout', labelKey: 'services.catalog.filters.fitout' },
  ];

  constructor(private translate: TranslateService) {}

  filteredServices = computed(() => {
    const list = this.services();
    const category = this.selectedCategory();
    const query = (this.searchQuery() || '').trim().toLowerCase();

    let result = list;

    if (category !== 'all') {
      result = result.filter((s) => s.category === category);
    }

    if (query) {
      result = result.filter((s) => {
        const slug = s.slug.toLowerCase();
        const title = (this.translate.instant(s.titleKey) || '').toLowerCase();
        const short = (this.translate.instant(s.shortKey) || '').toLowerCase();

        return slug.includes(query) || title.includes(query) || short.includes(query);
      });
    }

    return result;
  });

  totalItems = computed(() => this.filteredServices().length);

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize)));

  safeCurrentPage = computed(() => {
    const page = this.currentPage();
    const max = this.totalPages();

    if (page < 1) return 1;
    if (page > max) return max;
    return page;
  });

  pagedServices = computed(() => {
    const page = this.safeCurrentPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredServices().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.safeCurrentPage();
    const maxButtons = 3;

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - 1);
    let end = start + (maxButtons - 1);

    if (end > total) {
      end = total;
      start = Math.max(1, end - (maxButtons - 1));
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  setCategory(value: CategoryFilter): void {
    this.selectedCategory.set(value);
    this.currentPage.set(1);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value || '');
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    const max = this.totalPages();
    const next = Math.min(Math.max(1, page), max);
    this.currentPage.set(next);
  }

  prevPage(): void {
    this.goToPage(this.safeCurrentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.safeCurrentPage() + 1);
  }

  trackBySlug(_: number, service: Service): string {
    return service.slug;
  }
}