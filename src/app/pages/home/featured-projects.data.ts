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
    cover: 'assets/images/HomePage/FeaturedProjects/BEDROOM.png',
  },
  {
    slug: 'featured-coffee-house',
    titleKey: 'home.projectsData.items.featuredCoffeeHouse.title',
    categoryKey: 'home.projectsData.categories.commercial',
    cover: 'assets/images/HomePage/FeaturedProjects/COMMERCIAL.png',
  },
  {
    slug: 'featured-dining-room',
    titleKey: 'home.projectsData.items.featuredDiningRoom.title',
    categoryKey: 'home.projectsData.categories.diningRoom',
    cover: 'assets/images/HomePage/FeaturedProjects/DINING.jpg',
  },
  {
    slug: 'featured-diwaneya',
    titleKey: 'home.projectsData.items.featuredDiwaneya.title',
    categoryKey: 'home.projectsData.categories.diwaneya',
    cover: 'assets/images/HomePage/FeaturedProjects/DIWANEYA.png',
  },
  {
    slug: 'featured-kitchen',
    titleKey: 'home.projectsData.items.featuredKitchen.title',
    categoryKey: 'home.projectsData.categories.kitchen',
    cover: 'assets/images/HomePage/FeaturedProjects/KITCHEN.png',
  },
  {
    slug: 'featured-living-room',
    titleKey: 'home.projectsData.items.featuredLivingRoom.title',
    categoryKey: 'home.projectsData.categories.livingRoom',
    cover: 'assets/images/HomePage/FeaturedProjects/LIVING.png',
  },
  {
    slug: 'featured-office',
    titleKey: 'home.projectsData.items.featuredOffice.title',
    categoryKey: 'home.projectsData.categories.office',
    cover: 'assets/images/HomePage/FeaturedProjects/OFFICE.png',
  },
  {
    slug: 'featured-outdoor-terrace-roof',
    titleKey: 'home.projectsData.items.featuredOutdoorTerraceRoof.title',
    categoryKey: 'home.projectsData.categories.outdoor',
    cover: 'assets/images/HomePage/FeaturedProjects/OUTDOOR.png',
  },
  {
    slug: 'featured-pool',
    titleKey: 'home.projectsData.items.featuredPool.title',
    categoryKey: 'home.projectsData.categories.pool',
    cover: 'assets/images/HomePage/FeaturedProjects/POOL.png',
  },
  {
    slug: 'featured-reception-hall',
    titleKey: 'home.projectsData.items.featuredReceptionHall.title',
    categoryKey: 'home.projectsData.categories.reception',
    cover: 'assets/images/HomePage/FeaturedProjects/RECEPTION.png',
  },
];
