export type Service = {
    slug: string;
    title: string;
    short: string;
    bullets: string[];
    heroImage?: string; // optional
  };
  
  export const SERVICES: Service[] = [
    {
      slug: 'residential-interior-design',
      title: 'Residential Interior Design',
      short: 'Full interior design solutions for villas and apartments, built around your lifestyle and preferences.',
      bullets: [
        'Space planning and layout optimization',
        'Mood boards, concept direction, and styles',
        'Material selection and finishing guidance',
        'Furniture, lighting, and décor coordination',
      ],
      heroImage: 'assets/images/services/residential.webp',
    },
    {
      slug: 'apartment-renovation',
      title: 'Apartment Renovation',
      short: 'Renovation planning and execution with a focus on functionality, premium finishes, and clean delivery.',
      bullets: [
        'Renovation planning and scope definition',
        'Finishing packages and material options',
        'Site supervision and quality control',
        'Handover-ready results',
      ],
      heroImage: 'assets/images/services/renovation.webp',
    },
    {
      slug: 'turnkey-fitout',
      title: 'Turnkey Fit-out',
      short: 'A complete end-to-end service: design, contracting, execution, coordination, and handover.',
      bullets: [
        'Design + execution under one workflow',
        'Timeline coordination and vendor management',
        'Finishing and detail workmanship control',
        'Project handover with final inspection',
      ],
      heroImage: 'assets/images/services/turnkey.webp',
    },
  ];
  