export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    cover: string;        // image path
    publishedAt: string;  // ISO date string
    readMins: number;
    content: string[];    // paragraphs (simple + safe for Phase 1)
  };
  
  export const BLOG_CATEGORIES = ['All', 'Interior Tips', 'Materials', 'Budget', 'Kuwait Homes'] as const;
  
  export const BLOG_POSTS: BlogPost[] = [
    {
      slug: 'how-to-plan-a-residential-interior-project-in-kuwait',
      title: 'How to Plan a Residential Interior Project in Kuwait',
      excerpt:
        'A practical checklist covering scope, timeline, budget, and what to prepare before your first consultation.',
      category: 'Kuwait Homes',
      tags: ['Kuwait', 'Consultation', 'Planning'],
      cover: 'assets/images/blog/b1.webp',
      publishedAt: '2025-12-01',
      readMins: 6,
      content: [
        'Planning a residential interior project starts with clarity: what spaces you want to improve, what problems you want to solve, and what “success” looks like for your lifestyle.',
        'Before your consultation, prepare references (photos you like), your approximate budget range, and any constraints such as timelines, building rules, or family needs.',
        'A professional workflow typically follows: consultation → concept direction → proposal → contract → execution → handover. The more defined the scope, the smoother the delivery.',
        'If you want quick wins, start with the highest-impact areas: living room, master bedroom, and lighting plan. These usually improve the overall feel of the home immediately.',
      ],
    },
    {
      slug: 'choosing-finishing-materials-what-actually-matters',
      title: 'Choosing Finishing Materials: What Actually Matters',
      excerpt:
        'Not all finishes perform the same. Here’s how to evaluate durability, maintenance, and overall value for residential living.',
      category: 'Materials',
      tags: ['Finishes', 'Durability', 'Quality'],
      cover: 'assets/images/blog/b2.webp',
      publishedAt: '2025-11-18',
      readMins: 5,
      content: [
        'A premium look is important, but performance is what protects your investment. Finishes should match the daily use of each space.',
        'When choosing materials, evaluate: durability, ease of cleaning, resistance to humidity, and how well they age over time.',
        'A good approach is to tier options: “best value”, “premium”, and “signature”. This keeps decisions clear while respecting budget.',
        'Ask for samples and view finishes under real lighting conditions. What looks perfect in a showroom may look different at home.',
      ],
    },
    {
      slug: 'interior-budgeting-where-to-spend-and-where-to-save',
      title: 'Interior Budgeting: Where to Spend and Where to Save',
      excerpt:
        'A strategic way to allocate your budget so you get a premium result without unnecessary overspending.',
      category: 'Budget',
      tags: ['Budget', 'BOQ', 'Priorities'],
      cover: 'assets/images/blog/b3.webp',
      publishedAt: '2025-10-30',
      readMins: 7,
      content: [
        'Budgeting becomes easy when you prioritize what’s visible and what’s structural. Spend on items that define the space and save on replaceable décor.',
        'Typically, lighting, flooring quality, and key joinery pieces (built-ins) provide the highest long-term value.',
        'Avoid over-customization in areas that may change often. Focus on flexible base design, then layer décor gradually.',
        'A clear BOQ/quotation with line items helps you make decisions with confidence and reduces surprises during execution.',
      ],
    },
  ];
  