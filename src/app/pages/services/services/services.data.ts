export type ServiceCategory = 'residential' | 'renovation' | 'fitout';

export type ServiceFaq = {
  qKey: string;
  aKey: string;
};

export type Service = {
  slug: string;
  category: ServiceCategory;
  titleKey: string;
  shortKey: string;
  aboutKey?: string;
  bulletsKeys: string[];
  heroImage: string;
  galleryImages?: string[];
  faqs?: ServiceFaq[];
  isActive: boolean;
  sortOrder: number;
};

export const SERVICES: Service[] = [
  {
    slug: 'residential-interior-design',
    category: 'residential',
    titleKey: 'services.items.residential.title',
    shortKey: 'services.items.residential.short',
    bulletsKeys: [
      'services.items.residential.bullets.1',
      'services.items.residential.bullets.2',
      'services.items.residential.bullets.3',
      'services.items.residential.bullets.4',
    ],
    heroImage: 'assets/images/services/residential.webp',
    galleryImages: [
      'assets/images/services/residential-interior-design/01.webp',
      'assets/images/services/residential-interior-design/02.webp',
      'assets/images/services/residential-interior-design/03.webp',
      'assets/images/services/residential-interior-design/04.webp',
      'assets/images/services/residential-interior-design/05.webp',
    ],
    faqs: [
      { qKey: 'services.items.residential.faq.1.q', aKey: 'services.items.residential.faq.1.a' },
      { qKey: 'services.items.residential.faq.2.q', aKey: 'services.items.residential.faq.2.a' },
    ],
    isActive: true,
    sortOrder: 10,
  },
  {
    slug: 'apartment-renovation',
    category: 'renovation',
    titleKey: 'services.items.renovation.title',
    shortKey: 'services.items.renovation.short',
    bulletsKeys: [
      'services.items.renovation.bullets.1',
      'services.items.renovation.bullets.2',
      'services.items.renovation.bullets.3',
      'services.items.renovation.bullets.4',
    ],
    heroImage: 'assets/images/services/renovation.webp',
    galleryImages: [
      'assets/images/services/apartment-renovation/01.webp',
      'assets/images/services/apartment-renovation/02.webp',
      'assets/images/services/apartment-renovation/03.webp',
      'assets/images/services/apartment-renovation/04.webp',
      'assets/images/services/apartment-renovation/05.webp',
    ],
    faqs: [
      { qKey: 'services.items.renovation.faq.1.q', aKey: 'services.items.renovation.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 20,
  },
  {
    slug: 'turnkey-fitout',
    category: 'fitout',
    titleKey: 'services.items.fitout.title',
    shortKey: 'services.items.fitout.short',
    bulletsKeys: [
      'services.items.fitout.bullets.1',
      'services.items.fitout.bullets.2',
      'services.items.fitout.bullets.3',
      'services.items.fitout.bullets.4',
    ],
    heroImage: 'assets/images/services/turnkey.webp',
    galleryImages: [
      'assets/images/services/turnkey-fitout/01.webp',
      'assets/images/services/turnkey-fitout/02.webp',
      'assets/images/services/turnkey-fitout/03.webp',
      'assets/images/services/turnkey-fitout/04.webp',
      'assets/images/services/turnkey-fitout/05.webp',
      'assets/images/services/turnkey-fitout/06.webp',
    ],
    faqs: [
      { qKey: 'services.items.fitout.faq.1.q', aKey: 'services.items.fitout.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 30,
  },
  {
    slug: 'kitchen-design',
    category: 'residential',
    titleKey: 'services.items.kitchen.title',
    shortKey: 'services.items.kitchen.short',
    bulletsKeys: [
      'services.items.kitchen.bullets.1',
      'services.items.kitchen.bullets.2',
      'services.items.kitchen.bullets.3',
      'services.items.kitchen.bullets.4',
    ],
    heroImage: 'assets/images/services/kitchen.webp',
    galleryImages: [
      'assets/images/services/kitchen-design/01.webp',
      'assets/images/services/kitchen-design/02.webp',
      'assets/images/services/kitchen-design/03.webp',
      'assets/images/services/kitchen-design/04.webp',
    ],
    faqs: [
      { qKey: 'services.items.kitchen.faq.1.q', aKey: 'services.items.kitchen.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 40,
  },
  {
    slug: 'bathroom-design',
    category: 'residential',
    titleKey: 'services.items.bathroom.title',
    shortKey: 'services.items.bathroom.short',
    bulletsKeys: [
      'services.items.bathroom.bullets.1',
      'services.items.bathroom.bullets.2',
      'services.items.bathroom.bullets.3',
      'services.items.bathroom.bullets.4',
    ],
    heroImage: 'assets/images/services/bathroom.webp',
    galleryImages: [
      'assets/images/services/bathroom-design/01.webp',
      'assets/images/services/bathroom-design/02.webp',
      'assets/images/services/bathroom-design/03.webp',
      'assets/images/services/bathroom-design/04.webp',
    ],
    faqs: [
      { qKey: 'services.items.bathroom.faq.1.q', aKey: 'services.items.bathroom.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 50,
  },
  {
    slug: 'flooring-and-materials',
    category: 'renovation',
    titleKey: 'services.items.flooring.title',
    shortKey: 'services.items.flooring.short',
    bulletsKeys: [
      'services.items.flooring.bullets.1',
      'services.items.flooring.bullets.2',
      'services.items.flooring.bullets.3',
      'services.items.flooring.bullets.4',
    ],
    heroImage: 'assets/images/services/flooring.webp',
    galleryImages: [
      'assets/images/services/flooring-and-materials/01.webp',
      'assets/images/services/flooring-and-materials/02.webp',
      'assets/images/services/flooring-and-materials/03.webp',
      'assets/images/services/flooring-and-materials/04.webp',
    ],
    faqs: [
      { qKey: 'services.items.flooring.faq.1.q', aKey: 'services.items.flooring.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 60,
  },
  {
    slug: 'lighting-design',
    category: 'fitout',
    titleKey: 'services.items.lighting.title',
    shortKey: 'services.items.lighting.short',
    bulletsKeys: [
      'services.items.lighting.bullets.1',
      'services.items.lighting.bullets.2',
      'services.items.lighting.bullets.3',
      'services.items.lighting.bullets.4',
    ],
    heroImage: 'assets/images/services/lighting.webp',
    galleryImages: [
      'assets/images/services/lighting-design/01.webp',
      'assets/images/services/lighting-design/02.webp',
      'assets/images/services/lighting-design/03.webp',
      'assets/images/services/lighting-design/04.webp',
      'assets/images/services/lighting-design/05.webp',
    ],
    faqs: [
      { qKey: 'services.items.lighting.faq.1.q', aKey: 'services.items.lighting.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 70,
  },
  {
    slug: 'space-planning',
    category: 'residential',
    titleKey: 'services.items.spacePlanning.title',
    shortKey: 'services.items.spacePlanning.short',
    bulletsKeys: [
      'services.items.spacePlanning.bullets.1',
      'services.items.spacePlanning.bullets.2',
      'services.items.spacePlanning.bullets.3',
      'services.items.spacePlanning.bullets.4',
    ],
    heroImage: 'assets/images/services/space-planning.webp',
    galleryImages: [
      'assets/images/services/space-planning/01.webp',
      'assets/images/services/space-planning/02.webp',
      'assets/images/services/space-planning/03.webp',
      'assets/images/services/space-planning/04.webp',
    ],
    faqs: [
      { qKey: 'services.items.spacePlanning.faq.1.q', aKey: 'services.items.spacePlanning.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 80,
  },
  {
    slug: 'custom-joinery',
    category: 'fitout',
    titleKey: 'services.items.joinery.title',
    shortKey: 'services.items.joinery.short',
    bulletsKeys: [
      'services.items.joinery.bullets.1',
      'services.items.joinery.bullets.2',
      'services.items.joinery.bullets.3',
      'services.items.joinery.bullets.4',
    ],
    heroImage: 'assets/images/services/joinery.webp',
    galleryImages: [
      'assets/images/services/custom-joinery/01.webp',
      'assets/images/services/custom-joinery/02.webp',
      'assets/images/services/custom-joinery/03.webp',
      'assets/images/services/custom-joinery/04.webp',
      'assets/images/services/custom-joinery/05.webp',
    ],
    faqs: [
      { qKey: 'services.items.joinery.faq.1.q', aKey: 'services.items.joinery.faq.1.a' },
    ],
    isActive: true,
    sortOrder: 90,
  },
];