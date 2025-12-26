import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

type HeaderLink = {
  label: string;
  path: string;
  exact?: boolean;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  /** Branding */
  @Input() logoSrc = 'assets/images/branding/logo.svg';
  @Input() brandName = 'IntoArt';

  /** Business CTAs */
  @Input() whatsappNumber = '96550000000'; // Kuwait format: country code + number, no +
  @Input() consultationPath = '/book-consultation';

  /** Navigation */
  links: HeaderLink[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  // UI state
  mobileOpen = signal(false);
  scrolled = signal(false);

  constructor(private router: Router) {
    // Close drawer on navigation for a clean UX
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.mobileOpen.set(false));
  }

  toggleMobile(): void {
    this.mobileOpen.set(!this.mobileOpen());
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  goToConsultation(): void {
    this.router.navigateByUrl(this.consultationPath);
  }

  openWhatsApp(): void {
    // wa.me requires country code, no plus signs
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('window:keydown.escape')
  onEsc(): void {
    this.closeMobile();
  }
}
