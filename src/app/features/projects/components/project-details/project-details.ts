import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PROJECTS, Project } from '../../services/projects.data';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.scss'],
})
export class ProjectDetailsPage {
  constructor(private route: ActivatedRoute) {}

  project = computed<Project | null>(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return PROJECTS.find((p) => p.slug === slug) ?? null;
  });

  // ========= Lightbox state =========
  lightboxOpen = signal(false);
  activeIndex = signal(0);

  images = computed(() => this.project()?.gallery ?? []);
  activeImage = computed(() => this.images()[this.activeIndex()] ?? '');

  openLightbox(index: number): void {
    const imgs = this.images();
    if (!imgs.length) return;

    const safeIndex = Math.max(0, Math.min(index, imgs.length - 1));
    this.activeIndex.set(safeIndex);
    this.lightboxOpen.set(true);

    // Lock scroll (clean UX)
    document.documentElement.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    document.documentElement.style.overflow = '';
  }

  nextImage(): void {
    const imgs = this.images();
    if (!imgs.length) return;

    const next = (this.activeIndex() + 1) % imgs.length;
    this.activeIndex.set(next);
  }

  prevImage(): void {
    const imgs = this.images();
    if (!imgs.length) return;

    const prev = (this.activeIndex() - 1 + imgs.length) % imgs.length;
    this.activeIndex.set(prev);
  }

  // Keyboard controls
  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen()) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeLightbox();
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.nextImage();
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.prevImage();
      return;
    }
  }
}
