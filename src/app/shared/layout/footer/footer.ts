import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type FooterLink = { labelKey: string; path: string };
type SocialLink = {
  labelKey: string;
  href: string;
  icon: 'instagram' | 'linkedin';
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

  socialLinks: SocialLink[] = [
    { labelKey: 'footer.social.instagram', href: '#', icon: 'instagram' },
    { labelKey: 'footer.social.linkedin', href: '#', icon: 'linkedin' },
  ];

  quickLinks: FooterLink[] = [
    { labelKey: 'footer.links.home', path: '/' },
    { labelKey: 'footer.links.about', path: '/about' },
    { labelKey: 'footer.links.services', path: '/services' },
    { labelKey: 'footer.links.projects', path: '/projects' },
    { labelKey: 'footer.links.contact', path: '/contact' },
    { labelKey: 'footer.links.faq', path: '/faq' },
    { labelKey: 'footer.links.bookConsultation', path: '/book-consultation' },
  ];

  serviceLinks: FooterLink[] = [
    { labelKey: 'footer.servicesLinks.residentialInterior', path: '/services' },
    { labelKey: 'footer.servicesLinks.apartmentRenovation', path: '/services' },
    { labelKey: 'footer.servicesLinks.turnkeyFitOut', path: '/services' },
  ];
}
