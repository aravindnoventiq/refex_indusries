export type CareersWhyCard = {
  title: string;
  description: string;
  icon: string;
};

export type CareersPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackground: string;
  heroCtaText: string;
  lifeEyebrow: string;
  lifeTitle: string;
  lifeSubtitle: string;
  lifeImage: string;
  whyTitle: string;
  whySubtitle: string;
  whyBackground: string;
  whyCards: CareersWhyCard[];
  whyValues: string[];
  talentEyebrow: string;
  talentTitle: string;
  talentBackground: string;
  formTitle: string;
  formSubtitle: string;
  isActive: boolean;
};

export const FALLBACK_CAREERS_PAGE: CareersPageContent = {
  heroEyebrow: 'Careers',
  heroTitle: 'Ready to Make Your Mark?',
  heroSubtitle:
    'Build a meaningful career with a purpose-driven organization shaping a cleaner, greener tomorrow across India.',
  heroBackground: '/careers/hero-bg.png',
  heroCtaText: 'Join Our Talent Community',
  lifeEyebrow: 'Our Culture',
  lifeTitle: 'Life as A #Refexian',
  lifeSubtitle: 'Diverse Perspectives. Shared Purpose. Limitless Possibilities.',
  lifeImage: '/careers/life-as-refexian-gallery.png',
  whyTitle: 'Why Choose Refex',
  whySubtitle:
    'Discover a workplace where purpose, growth, and innovation come together to build a cleaner, stronger, and more sustainable future.',
  whyBackground: '/careers/why-choose-refex-bg.png',
  whyCards: [
    {
      title: 'Purpose-Driven Work',
      description:
        'Be part of projects that advance cleaner industries, strengthen communities, and create lasting value for society.',
      icon: 'Target',
    },
    {
      title: 'Continuous Growth',
      description:
        'Take on meaningful challenges, learn from experienced leaders, and accelerate your career through continuous development.',
      icon: 'TrendingUp',
    },
    {
      title: 'Inclusive by Culture',
      description:
        'We believe diverse perspectives drive better outcomes. Every voice is valued, respected, and encouraged to contribute.',
      icon: 'Users',
    },
    {
      title: 'Innovation in Action',
      description:
        'Work on complex industrial challenges across circular economy, sustainability, mobility, renewable energy, and technology-driven operations.',
      icon: 'Lightbulb',
    },
    {
      title: 'Well-Being Matters',
      description:
        'We support your physical, mental, and professional well-being because thriving people build thriving organizations.',
      icon: 'Heart',
    },
    {
      title: 'Safety First, Always',
      description:
        'Safety is embedded in everything we do, creating a workplace where people can perform with confidence and care.',
      icon: 'Shield',
    },
    {
      title: 'Recognized & Rewarded',
      description:
        'We celebrate achievements, acknowledge contributions, and create opportunities for people to grow through trust and recognition.',
      icon: 'Award',
    },
    {
      title: 'Building Tomorrow Together',
      description:
        "Join an organization that's evolving, expanding, and shaping the future of sustainable industry in India.",
      icon: 'Sprout',
    },
  ],
  whyValues: ['Sustainability', 'Integrity', 'Innovation', 'Collaboration', 'Excellence'],
  talentEyebrow: 'Join Our Talent Network',
  talentTitle: 'Stay connected with opportunities.',
  talentBackground: '/careers/hero-bg.png',
  formTitle: 'Share Your Information',
  formSubtitle: 'Help us get to know you better.',
  isActive: true,
};

export function mergeCareersPage(data?: Partial<CareersPageContent> | null): CareersPageContent {
  return {
    ...FALLBACK_CAREERS_PAGE,
    ...data,
    whyCards:
      Array.isArray(data?.whyCards) && data.whyCards.length > 0
        ? data.whyCards
        : FALLBACK_CAREERS_PAGE.whyCards,
    whyValues:
      Array.isArray(data?.whyValues) && data.whyValues.length > 0
        ? data.whyValues
        : FALLBACK_CAREERS_PAGE.whyValues,
  };
}
