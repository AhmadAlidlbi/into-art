import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EventEmitter, Output } from '@angular/core';

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
  @Output() mobileOpenChange = new EventEmitter<boolean>();
  /** Branding */
  @Input() logoSrc = 'assets/images/branding/logo.svg';
  @Input() brandName = 'IntoArt';

  /** Business CTAs */
  @Input() consultationPath = '/book-consultation';

  /** Navigation */
  links: HeaderLink[] = [
    { labelKey: 'nav.home', path: '/', exact: true },
    { labelKey: 'nav.services', path: '/under-construction' },
    { labelKey: 'nav.projects', path: '/under-construction' },
    { labelKey: 'nav.about', path: '/under-construction' },
    { labelKey: 'nav.contact', path: '/under-construction' },
  ];

  // UI state
  mobileOpen = signal(false);
  scrolled = signal(false);

  // Lang state
  currentLang = signal<'en' | 'ar'>('en');

  constructor(private router: Router, private translate: TranslateService) {
    // Close drawer on navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.mobileOpen.set(false);
        this.mobileOpenChange.emit(false);
      });

    // Init language from storage
    const saved = (localStorage.getItem('lang') as 'en' | 'ar' | null) ?? 'en';
    this.applyLang(saved, false);
  }

  toggleMobile(): void {
    const next = !this.mobileOpen();
    this.mobileOpen.set(next);
    this.mobileOpenChange.emit(next);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
    this.mobileOpenChange.emit(false);
  }

  goToConsultation(): void {
    this.router.navigateByUrl(this.consultationPath);
    this.closeMobile();
  }

  toggleLang(): void {
    // Close drawer first to avoid mid-transition swap
    if (this.mobileOpen()) this.closeMobile();

    const next = this.currentLang() === 'ar' ? 'en' : 'ar';

    // Lock transitions during direction flip
    document.documentElement.classList.add('dir-switching');

    this.applyLang(next, true);

    // Unlock after layout applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('dir-switching');
      });
    });
  }

  private applyLang(lang: 'en' | 'ar', persist: boolean): void {
    this.currentLang.set(lang);
    if (persist) localStorage.setItem('lang', lang);

    this.translate.use(lang);

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
    if (window.innerWidth > 980 && this.mobileOpen()) this.closeMobile();
  }
}
