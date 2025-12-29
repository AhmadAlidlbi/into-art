import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type HeaderLink = {
  labelKey: string;
  path: string;
  exact?: boolean;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  /** Branding */
  @Input() logoSrc = 'assets/images/branding/logo.svg';
  @Input() brandName = 'IntoArt';

  /** Business CTAs */
  @Input() consultationPath = '/book-consultation';

  /** Navigation */
  links: HeaderLink[] = [
    { labelKey: 'nav.home', path: '/', exact: true },
    { labelKey: 'nav.services', path: '/services' },
    { labelKey: 'nav.projects', path: '/projects' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];

  // UI state
  mobileOpen = signal(false);
  scrolled = signal(false);

  // Lang state
  currentLang = signal<'en' | 'ar'>('en');

  constructor(private router: Router, private translate: TranslateService) {
    // close drawer on navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.mobileOpen.set(false));

    // init language from storage (fallback en)
    const saved = (localStorage.getItem('lang') as 'en' | 'ar' | null) ?? 'en';
    this.applyLang(saved, false);
  }

  toggleMobile(): void {
    this.mobileOpen.set(!this.mobileOpen());
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  goToConsultation(): void {
    this.router.navigateByUrl(this.consultationPath);
    this.closeMobile();
  }

  toggleLang(): void {
    // close drawer first to avoid mid-transition swap
    const wasOpen = this.mobileOpen();
    if (wasOpen) this.closeMobile();

    const next = this.currentLang() === 'ar' ? 'en' : 'ar';

    // prevent CSS transition during dir change
    document.documentElement.classList.add('dir-switching');

    // do the actual switch
    this.applyLang(next, true);

    // remove the transition lock after the browser applies layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('dir-switching');
      });
    });
  }

  private applyLang(lang: 'en' | 'ar', persist: boolean): void {
    this.currentLang.set(lang);

    if (persist) localStorage.setItem('lang', lang);

    // apply translate
    this.translate.use(lang);

    // apply direction + lang immediately for correct layout
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    this.closeMobile();
  }

  @HostListener('window:resize')
  onResize(): void {
    // ✅ If user expands browser to desktop width, close mobile drawer
    if (window.innerWidth > 980 && this.mobileOpen()) {
      this.closeMobile();
    }
  }
}
