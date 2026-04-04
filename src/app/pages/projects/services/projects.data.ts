export type Project = {
    slug: string;
    title: string;
    category: string;
    location?: string;
    area?: string;
    year?: string;
    cover: string;
    gallery: string[];
    summary: string;
    scope: string[];
    featured?: boolean; // ✅ add
  };
  
  
  export const PROJECT_CATEGORIES = [
    'All',
    'Villa',
    'Apartment',
    'Living Room',
    'Bedroom',
    'Majlis',
    'Kitchen',
  ] as const;
  
  export const PROJECTS: Project[] = [
    {
      slug: 'modern-apartment-living-room',
      title: 'Modern Apartment Living Room',
      category: 'Living Room',
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
      summary:
        'A modern living room concept focused on clean lines, warm textures, and practical circulation for daily use.',
      scope: [
        'Space planning & layout',
        'Material & color selection',
        'Lighting guidance',
        'Execution supervision',
      ],
    },
    {
      slug: 'warm-minimal-bedroom',
      title: 'Warm Minimal Bedroom',
      category: 'Bedroom',
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
      summary:
        'A calm, minimal bedroom with warm finishes and integrated storage for a refined everyday experience.',
      scope: [
        'Concept design',
        'Furniture & storage planning',
        'Finishes and detailing',
        'Handover-ready delivery',
      ],
    },
    {
      slug: 'contemporary-villa-majlis',
      title: 'Contemporary Villa Majlis',
      category: 'Majlis',
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
      summary:
        'A villa majlis designed with contemporary elegance, layered lighting, and premium finishes.',
      scope: [
        'Space planning',
        'Lighting and ceiling details',
        'Finishing package selection',
        'Site supervision',
      ],
    },
  ];
  