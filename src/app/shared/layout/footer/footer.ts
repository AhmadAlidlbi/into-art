import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

type FooterLink = { label: string; path: string };
type SocialLink = { label: string; href: string; icon: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' };

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent {
  year = new Date().getFullYear();

  @Input() brandName = 'IntoArt';
  @Input() logoSrc = 'assets/images/branding/w-logo.svg';

  @Input() description =
    'Residential interior design and turnkey fit-out solutions in Kuwait. We design, execute, and deliver refined spaces with a focus on quality and detail.';

  @Input() consultationPath = '/book-consultation';

  @Input() whatsappNumber = '96566576673';
  @Input() phoneNumberDisplay = '+965 6657 6673';
  @Input() phoneNumberDial = '+96550000000';

  @Input() email = 'info@intoakwt.com';
  @Input() address = 'Silk Tower. Floor 23. Office 66, Jaber St, Kuwait City';

  @Input() googleMapsEmbedUrl = 'https://www.google.com/maps?q=Kuwait&output=embed';

  quickLinks: FooterLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' },
    { label: 'Projects', path: '/projects' },
  ];

  serviceLinks: FooterLink[] = [
    { label: 'Residential Interior Design', path: '/services/residential-interior-design' },
    { label: 'Apartment Renovation', path: '/services/apartment-renovation' },
    { label: 'Turnkey Fit-out', path: '/services/turnkey-fitout' },
  ];

  // ✅ Replace hrefs later with your real URLs
  socialLinks: SocialLink[] = [
    { label: 'Instagram', href: '#https://www.instagram.com/intoart_kwt/?igsh=cG90N2dlNTFxbjBu#', icon: 'instagram' },
    { label: 'TikTok', href: '#', icon: 'tiktok' },
    { label: 'YouTube', href: '#', icon: 'youtube' },
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  ];

  openWhatsApp(): void {
    window.open(`https://wa.me/${this.whatsappNumber}`, '_blank', 'noopener,noreferrer');
  }
}
