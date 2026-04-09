export type FeaturedProject = {
  slug: string;
  titleKey: string;
  categoryKey: string;
  cover: string;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'featured-bedroom',
    titleKey: 'home.projectsData.items.featuredBedroom.title',
    categoryKey: 'home.projectsData.categories.bedroom',
    cover: 'assets/images/HomePage/FeaturedProjects/BEDROOM.webp',
  },
  {
    slug: 'featured-coffee-house',
    titleKey: 'home.projectsData.items.featuredCoffeeHouse.title',
    categoryKey: 'home.projectsData.categories.commercial',
    cover: 'assets/images/HomePage/FeaturedProjects/COMMERCIAL.webp',
  },
  {
    slug: 'featured-dining-room',
    titleKey: 'home.projectsData.items.featuredDiningRoom.title',
    categoryKey: 'home.projectsData.categories.diningRoom',
    cover: 'assets/images/HomePage/FeaturedProjects/DINING.webp',
  },
  {
    slug: 'featured-diwaneya',
    titleKey: 'home.projectsData.items.featuredDiwaneya.title',
    categoryKey: 'home.projectsData.categories.diwaneya',
    cover: 'assets/images/HomePage/FeaturedProjects/DIWANEYA.webp',
  },
  {
    slug: 'featured-kitchen',
    titleKey: 'home.projectsData.items.featuredKitchen.title',
    categoryKey: 'home.projectsData.categories.kitchen',
    cover: 'assets/images/HomePage/FeaturedProjects/KITCHEN.webp',
  },
  {
    slug: 'featured-living-room',
    titleKey: 'home.projectsData.items.featuredLivingRoom.title',
    categoryKey: 'home.projectsData.categories.livingRoom',
    cover: 'assets/images/HomePage/FeaturedProjects/LIVING.webp',
  },
  {
    slug: 'featured-office',
    titleKey: 'home.projectsData.items.featuredOffice.title',
    categoryKey: 'home.projectsData.categories.office',
    cover: 'assets/images/HomePage/FeaturedProjects/OFFICE.webp',
  },
  {
    slug: 'featured-outdoor-terrace-roof',
    titleKey: 'home.projectsData.items.featuredOutdoorTerraceRoof.title',
    categoryKey: 'home.projectsData.categories.outdoor',
    cover: 'assets/images/HomePage/FeaturedProjects/OUTDOOR.webp',
  },
  {
    slug: 'featured-pool',
    titleKey: 'home.projectsData.items.featuredPool.title',
    categoryKey: 'home.projectsData.categories.pool',
    cover: 'assets/images/HomePage/FeaturedProjects/POOL.webp',
  },
  {
    slug: 'featured-reception-hall',
    titleKey: 'home.projectsData.items.featuredReceptionHall.title',
    categoryKey: 'home.projectsData.categories.reception',
    cover: 'assets/images/HomePage/FeaturedProjects/RECEPTION.webp',
  },
];
