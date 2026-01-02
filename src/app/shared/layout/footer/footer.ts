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
    { labelKey: 'footer.links.services', path: '/under-construction' },
    { labelKey: 'footer.links.portfolio', path: '/under-construction' },
    { labelKey: 'footer.links.about', path: '/under-construction' },
    { labelKey: 'footer.links.faq', path: '/under-construction' },
    { labelKey: 'footer.links.contact', path: '/under-construction' },
    { labelKey: 'footer.links.blog', path: '/under-construction' },
    { labelKey: 'footer.links.projects', path: '/under-construction' },
  ];

  serviceLinks: FooterLink[] = [
    { labelKey: 'footer.servicesLinks.residentialInterior', path: '/under-construction' },
    { labelKey: 'footer.servicesLinks.apartmentRenovation', path: '/under-construction' },
    { labelKey: 'footer.servicesLinks.turnkeyFitOut', path: '/under-construction' },
  ];
}
