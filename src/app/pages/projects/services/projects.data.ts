export type ProjectType = 'design' | 'execution';

export type Project = {
  slug: string;
  titleKey: string;
  categoryKey: string;
  type: ProjectType;
  location?: string;
  area?: string;
  year?: string;
  cover: string;
  gallery: string[];
  summaryKey: string;
  scopeKeys: string[];
  featured?: boolean;
};

export const PROJECT_CATEGORIES = [
  { value: 'All', labelKey: 'projects.filters.all' },
  { value: 'Villa', labelKey: 'projectsData.categories.villa' },
  { value: 'Apartment', labelKey: 'projectsData.categories.apartment' },
  { value: 'Living Room', labelKey: 'projectsData.categories.livingRoom' },
  { value: 'Bedroom', labelKey: 'projectsData.categories.bedroom' },
  { value: 'Majlis', labelKey: 'projectsData.categories.majlis' },
  { value: 'Kitchen', labelKey: 'projectsData.categories.kitchen' },
] as const;

export const PROJECTS: Project[] = [
  {
    slug: 'modern-apartment-living-room',
    titleKey: 'projectsData.items.modernApartmentLivingRoom.title',
    categoryKey: 'projectsData.categories.livingRoom',
    type: 'design',
    featured: true,
    location: 'Kuwait',
    area: 'Salmiya',
    year: '2025',
    cover: 'assets/images/portfolio/projects/p1.webp',
    gallery: [
      'assets/images/portfolio/projects/p1.webp',
      'assets/images/portfolio/projects/p1-2.webp',
      'assets/images/portfolio/projects/p1-3.webp',
    ],
    summaryKey: 'projectsData.items.modernApartmentLivingRoom.summary',
    scopeKeys: [
      'projectsData.items.modernApartmentLivingRoom.scope.1',
      'projectsData.items.modernApartmentLivingRoom.scope.2',
      'projectsData.items.modernApartmentLivingRoom.scope.3',
      'projectsData.items.modernApartmentLivingRoom.scope.4',
    ],
  },
  {
    slug: 'warm-minimal-bedroom',
    titleKey: 'projectsData.items.warmMinimalBedroom.title',
    categoryKey: 'projectsData.categories.bedroom',
    type: 'execution',
    featured: true,
    location: 'Kuwait',
    area: 'Hawally',
    year: '2025',
    cover: 'assets/images/portfolio/projects/p2.webp',
    gallery: [
      'assets/images/portfolio/projects/p2.webp',
      'assets/images/portfolio/projects/p2-2.webp',
      'assets/images/portfolio/projects/p2-3.webp',
    ],
    summaryKey: 'projectsData.items.warmMinimalBedroom.summary',
    scopeKeys: [
      'projectsData.items.warmMinimalBedroom.scope.1',
      'projectsData.items.warmMinimalBedroom.scope.2',
      'projectsData.items.warmMinimalBedroom.scope.3',
      'projectsData.items.warmMinimalBedroom.scope.4',
    ],
  },
  {
    slug: 'contemporary-villa-majlis',
    titleKey: 'projectsData.items.contemporaryVillaMajlis.title',
    categoryKey: 'projectsData.categories.majlis',
    type: 'design',
    featured: true,
    location: 'Kuwait',
    area: 'Al-Zahra',
    year: '2024',
    cover: 'assets/images/portfolio/projects/p3.webp',
    gallery: [
      'assets/images/portfolio/projects/p3.webp',
      'assets/images/portfolio/projects/p3-2.webp',
      'assets/images/portfolio/projects/p3-3.webp',
    ],
    summaryKey: 'projectsData.items.contemporaryVillaMajlis.summary',
    scopeKeys: [
      'projectsData.items.contemporaryVillaMajlis.scope.1',
      'projectsData.items.contemporaryVillaMajlis.scope.2',
      'projectsData.items.contemporaryVillaMajlis.scope.3',
      'projectsData.items.contemporaryVillaMajlis.scope.4',
    ],
  },
];
