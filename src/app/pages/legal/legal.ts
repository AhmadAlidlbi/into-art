import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './legal.html',
  styleUrls: ['./legal.scss'],
})
export class LegalPage implements AfterViewInit, OnDestroy {
  brandName = 'INTO ART';
  website = 'intoartkw.com';
  contactEmail = 'info@intoartkw.com';

  effectiveDate = 'December 26, 2025';
  lastUpdated = 'December 26, 2025';

  activeId = signal<'privacy' | 'cookies' | 'terms' | 'disclaimer' | 'contact'>('privacy');
  toast = signal<string | null>(null);

  private obs?: IntersectionObserver;
  private toastTimer?: number;

  constructor(private translate: TranslateService) {}

  ngAfterViewInit(): void {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-observe]'));
    if (!sections.length) return;

    this.obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        const id = (visible?.target as HTMLElement | undefined)?.id as any;
        if (id) this.activeId.set(id);
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((s) => this.obs?.observe(s));
  }

  ngOnDestroy(): void {
    this.obs?.disconnect();
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  }

  onTocClick(ev: Event, id: string): void {
    ev.preventDefault();
    this.scrollTo(id);
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeId.set(id as any);
    history.replaceState(null, '', `#${id}`);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
  }

  printPage(): void {
    window.print();
  }

  async copyEmail(): Promise<void> {
    await this.copyToClipboard(this.contactEmail);
    this.showToast(this.translate.instant('legal.toast.emailCopied'));
  }

  async copyLink(id: string): Promise<void> {
    const url = `${location.origin}${location.pathname}#${id}`;
    await this.copyToClipboard(url);
    this.showToast(this.translate.instant('legal.toast.linkCopied'));
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {
      // fallback below
    }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }

  private showToast(msg: string): void {
    this.toast.set(msg);
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.set(null), 1800);
  }
}
