import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal, EventEmitter, Output } from '@angular/core';
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
  @Output() mobileOpenChange = new EventEmitter<boolean>();
  @Input() logoSrc = 'assets/images/branding/logo.svg';
  @Input() brandName = 'INTO ART';
  @Input() consultationPath = '/book-consultation';

  links: HeaderLink[] = [
    { labelKey: 'nav.home', path: '/', exact: true },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.services', path: '/services' },
    { labelKey: 'nav.projects', path: '/projects' },
    { labelKey: 'nav.faq', path: '/faq' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];

  mobileOpen = signal(false);
  scrolled = signal(false);

  currentLang = signal<'en' | 'ar'>('ar');

  constructor(private router: Router, private translate: TranslateService) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.mobileOpen.set(false);
        this.mobileOpenChange.emit(false);
      });

    const saved = (localStorage.getItem('lang') as 'en' | 'ar' | null) ?? 'ar';
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
    if (this.mobileOpen()) this.closeMobile();

    const next = this.currentLang() === 'ar' ? 'en' : 'ar';

    document.documentElement.classList.add('dir-switching');

    this.applyLang(next, true);

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
