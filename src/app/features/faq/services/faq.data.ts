export type FaqItem = {
    category: string;
    q: string;
    a: string;
  };
  
  export const FAQ_CATEGORIES = ['All', 'Process', 'Pricing', 'Execution', 'Timeline', 'Design'] as const;
  
  export const FAQS: FaqItem[] = [
    {
      category: 'Process',
      q: 'How do I book a consultation?',
      a: 'You can book directly through the website consultation page. Once submitted, our team will confirm the appointment and guide you on the next steps.',
    },
    {
      category: 'Process',
      q: 'What happens after the consultation?',
      a: 'After the consultation, we review your requirements and prepare the design direction and proposal. If you approve, we move to contract and execution planning.',
    },
    {
      category: 'Pricing',
      q: 'Do you provide a quotation or BOQ?',
      a: 'Yes. Depending on the project scope, we provide a structured quotation with clear line items, materials, and execution scope.',
    },
    {
      category: 'Pricing',
      q: 'Can I choose materials based on my budget?',
      a: 'Yes. We typically propose options in tiers and recommend the best balance between quality and budget for residential projects.',
    },
    {
      category: 'Execution',
      q: 'Do you handle execution or design only?',
      a: 'We can provide both. Many residential clients prefer end-to-end delivery (design + execution) with supervision for quality and finishing.',
    },
    {
      category: 'Execution',
      q: 'Who supervises the site work?',
      a: 'A dedicated engineer supervises execution, tracks progress, and ensures finishing quality aligns with the approved design.',
    },
    {
      category: 'Timeline',
      q: 'How long does a residential project take?',
      a: 'It depends on size and scope. After the consultation and scope confirmation, we provide an estimated timeline and milestones.',
    },
    {
      category: 'Design',
      q: 'Can you match a style I found online?',
      a: 'Yes. Share references and we’ll adapt the style to fit your space, lighting, and practical living needs.',
    },
  ];
  