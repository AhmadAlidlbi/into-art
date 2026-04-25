export type FaqItem = {
  category: string;
  q: string;
  a: string;
};

export const FAQ_CATEGORIES = ['all', 'process', 'pricing', 'execution', 'design'];

export const FAQS: FaqItem[] = [
  { category: 'process', q: 'faq.items.1.q', a: 'faq.items.1.a' },
  { category: 'process', q: 'faq.items.2.q', a: 'faq.items.2.a' },

  { category: 'pricing', q: 'faq.items.3.q', a: 'faq.items.3.a' },
  { category: 'execution', q: 'faq.items.4.q', a: 'faq.items.4.a' },
  { category: 'pricing', q: 'faq.items.5.q', a: 'faq.items.5.a' },
  { category: 'design', q: 'faq.items.6.q', a: 'faq.items.6.a' },
  { category: 'pricing', q: 'faq.items.7.q', a: 'faq.items.7.a' },
  { category: 'design', q: 'faq.items.8.q', a: 'faq.items.8.a' },
  { category: 'pricing', q: 'faq.items.9.q', a: 'faq.items.9.a' },
  { category: 'design', q: 'faq.items.10.q', a: 'faq.items.10.a' },

  { category: 'execution', q: 'faq.items.11.q', a: 'faq.items.11.a' },
  { category: 'execution', q: 'faq.items.12.q', a: 'faq.items.12.a' },
  { category: 'design', q: 'faq.items.13.q', a: 'faq.items.13.a' },
  { category: 'pricing', q: 'faq.items.14.q', a: 'faq.items.14.a' },
  { category: 'execution', q: 'faq.items.15.q', a: 'faq.items.15.a' },
  { category: 'execution', q: 'faq.items.16.q', a: 'faq.items.16.a' },
  { category: 'execution', q: 'faq.items.17.q', a: 'faq.items.17.a' },
  { category: 'design', q: 'faq.items.18.q', a: 'faq.items.18.a' },
  { category: 'design', q: 'faq.items.19.q', a: 'faq.items.19.a' },
  { category: 'execution', q: 'faq.items.20.q', a: 'faq.items.20.a' },
];
