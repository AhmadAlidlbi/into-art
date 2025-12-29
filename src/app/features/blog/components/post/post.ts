import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BLOG_POSTS, BlogPost } from '../../services/blog.data';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
})
export class PostPage {
  constructor(private route: ActivatedRoute) {}

  post = computed<BlogPost | null>(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  });

  related(currentSlug: string): BlogPost[] {
    // Simple: show 2 others (same category first if possible)
    const current = BLOG_POSTS.find((x) => x.slug === currentSlug);
    const others = BLOG_POSTS.filter((x) => x.slug !== currentSlug);

    const ranked = current
      ? [
          ...others.filter((x) => x.category === current.category),
          ...others.filter((x) => x.category !== current.category),
        ]
      : others;

    return ranked.slice(0, 2);
  }

  formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map((x) => Number(x));
    if (!y || !m || !d) return iso;
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  outline(para: string, i: number): string {
    // A compact “TOC” label. Keeps it safe with your current content array model.
    const trimmed = (para ?? '').trim();
    const clean = trimmed.length > 70 ? `${trimmed.slice(0, 70)}…` : trimmed;
    return clean || `Section ${i + 1}`;
  }
}
