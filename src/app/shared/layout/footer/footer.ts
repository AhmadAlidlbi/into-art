import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type FooterLink = {
  labelKey: string;
  path: string;
  disabled?: boolean;
};

type SocialLink = {
  labelKey: string;
  href: string;
  icon: 'instagram' | 'linkedin';
  disabled?: boolean;
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  socialLinks: SocialLink[] = [
    {
      labelKey: 'footer.social.instagram',
      href: 'https://www.instagram.com/intoart_kwt/',
      icon: 'instagram',
    },
    {
      labelKey: 'footer.social.linkedin',
      href: '#',
      icon: 'linkedin',
      disabled: true,
    },
  ];

  quickLinks: FooterLink[] = [
    { labelKey: 'footer.links.home', path: '/' },
    { labelKey: 'footer.links.about', path: '/about', disabled: true },
    { labelKey: 'footer.links.services', path: '/services', disabled: true },
    { labelKey: 'footer.links.projects', path: '/projects', disabled: true },
    { labelKey: 'footer.links.contact', path: '/contact', disabled: true },
    { labelKey: 'footer.links.faq', path: '/faq', disabled: true },
    { labelKey: 'footer.links.bookConsultation', path: '/book-consultation' },
  ];

  serviceLinks: FooterLink[] = [
    {
      labelKey: 'footer.servicesLinks.residentialInterior',
      path: '/services',
      disabled: true,
    },
    {
      labelKey: 'footer.servicesLinks.apartmentRenovation',
      path: '/services',
      disabled: true,
    },
    {
      labelKey: 'footer.servicesLinks.turnkeyFitOut',
      path: '/services',
      disabled: true,
    },
  ];

  privacyPolicyLink = {
    labelKey: 'footer.terms',
    path: '/privacy-policy',
    disabled: true,
  };
}
