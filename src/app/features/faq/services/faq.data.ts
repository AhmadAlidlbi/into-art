export type FaqItem = {
  category: string;
  q: string;
  a: string;
};

export const FAQ_CATEGORIES = ['all', 'process', 'pricing', 'execution', 'timeline', 'design'];

export const FAQS: FaqItem[] = [
  {
    category: 'process',
    q: 'faq.items.1.q',
    a: 'faq.items.1.a',
  },
  {
    category: 'process',
    q: 'faq.items.2.q',
    a: 'faq.items.2.a',
  },
  {
    category: 'pricing',
    q: 'faq.items.3.q',
    a: 'faq.items.3.a',
  },
  {
    category: 'pricing',
    q: 'faq.items.4.q',
    a: 'faq.items.4.a',
  },
  {
    category: 'execution',
    q: 'faq.items.5.q',
    a: 'faq.items.5.a',
  },
  {
    category: 'execution',
    q: 'faq.items.6.q',
    a: 'faq.items.6.a',
  },
  {
    category: 'timeline',
    q: 'faq.items.7.q',
    a: 'faq.items.7.a',
  },
  {
    category: 'design',
    q: 'faq.items.8.q',
    a: 'faq.items.8.a',
  },
];
