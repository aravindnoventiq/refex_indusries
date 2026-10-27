export type RmcCard = { title: string; text: string };
export type RmcNews = { label: string; title: string; summary: string };

export type RmcPageContent = {
  headlineLine1: string;
  headlineLine2: string;
  bannerImage: string;
  about: string;
  advantages: RmcCard[];
  vision: string;
  products: string;
  productsImage: string;
  footprint: string;
  footprintImage: string;
  clients: string;
  clientsImage: string;
  sustainabilityTitle: string;
  sustainabilityIntro: string;
  sustainabilityCards: RmcCard[];
  sustainabilityClose: string;
  news: RmcNews[];
  leaderName: string;
  leaderRole: string;
  leaderBio: string;
  leaderImage: string;
  email: string;
  phone: string;
};

export const DEFAULT_RMC_PAGE: RmcPageContent = {
  headlineLine1: 'Strength for what you build now.',
  headlineLine2: 'Precision for where you grow next.',
  bannerImage: '',
  about:
    'Refex RMC empowers India’s progressive infrastructure with next-generation RMC solutions. Utilizing advanced manufacturing technology within QCI (Quality Control of India) certified plants, our concrete mixes ensure precise composition, high performance and unyielding quality control. Beyond delivering premium materials, we aim to transform client relationships into lasting strategic partnerships setting a higher benchmark for trust, structural reliability and seamless service execution.',
  advantages: [
    { title: 'QCI-Certified Quality', text: 'Guaranteed compliance with national standards.' },
    {
      title: 'Tech-Driven Operations',
      text: 'Combining modern plant automation with innovative, eco-friendly concrete solutions.',
    },
    { title: '100% On-Time Delivery', text: 'Reliable logistics ensuring zero site delays.' },
    { title: 'Zero Concrete Strength Failures', text: 'Tested to meet or exceed target strength every time.' },
    { title: 'Multi-Product Availability', text: 'Standard, specialized and custom high-grade mixes.' },
    {
      title: 'Green Concrete & Sustainable Practices',
      text: 'Eco-conscious formulations backed by responsible resource optimization, water recycling and zero-waste operations.',
    },
  ],
  vision:
    'To redefine modern construction across India through tech-driven plant operations, delivering precision engineering and guaranteed reliability in every pour.',
  products: '',
  productsImage: '',
  footprint: '',
  footprintImage: '',
  clients: '',
  clientsImage: '',
  sustainabilityTitle: 'Building Responsibly for a Greener Tomorrow',
  sustainabilityIntro:
    'At Refex Ready Mix Concrete, we are committed to shaping a sustainable urban landscape. Supported by Refex Group’s target to achieve carbon neutrality by 2035, we combine circular economy practices, low-carbon mix engineering and responsible resource management to reduce the environmental footprint of modern infrastructure.',
  sustainabilityCards: [
    {
      title: 'Circular Material Sourcing',
      text: 'Drawing on Refex’s ash management capabilities, we integrate high-grade fly ash and industrial cement substitutes into low-carbon mix designs—lowering carbon intensity without sacrificing strength or durability.',
    },
    {
      title: 'Water Stewardship & Recycling',
      text: 'Recognizing water as a precious shared resource, our RMC plants operate on advanced 100% water harvesting and recycling systems, eliminating unnecessary draw on local supplies.',
    },
    {
      title: 'Zero-Waste Operations',
      text: 'Through precision automated systems and raw material optimization across our RMC facilities, we minimize operational waste, lower dust emissions and optimize energy efficiency.',
    },
  ],
  sustainabilityClose:
    'For us, sustainability isn’t just about what we build—it’s about how responsibly we build it.',
  news: [
    {
      label: 'Announcement',
      title: 'Appointment of Mr Anil S Kulkarni',
      summary: 'Article summary to be added.',
    },
    {
      label: 'Operations',
      title: 'Commercial operations begin at Wadmukhwadi, Pune',
      summary:
        'Refex RMC started commercial operations at its first Ready-Mix Concrete plant in Wadmukhwadi, Pune, Maharashtra. Full article to be added.',
    },
  ],
  leaderName: 'Mr. Anil S. Kulkarni',
  leaderRole: 'RMC Leadership',
  leaderBio:
    'Mr. Anil S. Kulkarni is a seasoned business leader with over 29 years of experience in the Ready-Mix Concrete, concrete and building materials industry, with extensive expertise in business operations, profit centre management, strategic growth, market expansion and operational excellence. He holds a B.E./B.Tech. in Civil Engineering and an MBA/PGDM in Marketing.',
  leaderImage: '',
  email: 'refexrmc@refex.co.in',
  phone: '(+91) 11111 00000',
};

function filledList<T>(value: T[] | undefined, fallback: T[]) {
  return Array.isArray(value) && value.length ? value : fallback;
}

export function mergeRmcPage(cms?: Partial<RmcPageContent> | null): RmcPageContent {
  if (!cms) return DEFAULT_RMC_PAGE;
  const next: RmcPageContent = { ...DEFAULT_RMC_PAGE };
  (Object.keys(DEFAULT_RMC_PAGE) as (keyof RmcPageContent)[]).forEach((key) => {
    const value = cms[key];
    if (typeof value === 'string') {
      if (value.trim()) (next[key] as string) = value;
      return;
    }
  });
  next.advantages = filledList(cms.advantages, DEFAULT_RMC_PAGE.advantages);
  next.sustainabilityCards = filledList(cms.sustainabilityCards, DEFAULT_RMC_PAGE.sustainabilityCards);
  next.news = filledList(cms.news, DEFAULT_RMC_PAGE.news);
  return next;
}
