import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type FooterLink = { labelKey: string; path: string };
type SocialLink = {
  labelKey: string;
  href: string;
  icon: 'instagram' | 'tiktok' | 'youtube' | 'linkedin';
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent {
  year = new Date().getFullYear();

  // ✅ Replace later with your real URLs
  socialLinks: SocialLink[] = [
    { labelKey: 'footer.social.instagram', href: '#', icon: 'instagram' },
    { labelKey: 'footer.social.tiktok', href: '#', icon: 'tiktok' },
    { labelKey: 'footer.social.youtube', href: '#', icon: 'youtube' },
    { labelKey: 'footer.social.linkedin', href: '#', icon: 'linkedin' },
  ];

  // ✅ Paths unchanged — labels are translation keys
  quickLinks: FooterLink[] = [
    { labelKey: 'footer.links.home', path: '/' },
    { labelKey: 'footer.links.services', path: '/services' },
    { labelKey: 'footer.links.about', path: '/about' },
    { labelKey: 'footer.links.faq', path: '/faq' },
    { labelKey: 'footer.links.contact', path: '/contact' },
    { labelKey: 'footer.links.projects', path: '/projects' },
  ];

  serviceLinks: FooterLink[] = [
    { labelKey: 'footer.servicesLinks.residentialInterior', path: '/services' },
    { labelKey: 'footer.servicesLinks.apartmentRenovation', path: '/services' },
    { labelKey: 'footer.servicesLinks.turnkeyFitOut', path: '/services' },
  ];
}
