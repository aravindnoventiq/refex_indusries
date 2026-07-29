export interface BusinessMeta {
  tag: string;
  description: string;
  href: string;
  accent: string;
}

const META_RULES: Array<{ test: RegExp; meta: BusinessMeta }> = [
  {
    test: /ash|coal/i,
    meta: {
      tag: 'Ash & Coal',
      description:
        'End-to-end ash handling, disposal and coal yard management powering thermal plants across India.',
      href: '/ash-utilization',
      accent: '#f97316', // orange
    },
  },
  {
    test: /green mobility|mobility/i,
    meta: {
      tag: 'Green Mobility',
      description:
        'Sustainable corporate commuting and daily rides through an all-electric fleet, cutting emissions at scale.',
      href: 'https://refexmobility.com/',
      accent: '#7cd144', // green
    },
  },
  {
    test: /venwind|wind/i,
    meta: {
      tag: 'Venwind Refex',
      description:
        "Driving India's wind energy future with advanced 5.3 MW turbine manufacturing.",
      href: 'https://venwindrefex.com/',
      accent: '#3b82f6', // blue
    },
  },
  {
    test: /refrigerant/i,
    meta: {
      tag: 'Refrigerant Gas',
      description:
        'Eco-friendly refrigerant gases backed by automated filling and certified quality control.',
      href: '/refrigerant-gas',
      accent: '#f59e0b',
    },
  },
];

const DEFAULT_META: BusinessMeta = {
  tag: 'Refex Industries',
  description: 'A diversified enterprise building a cleaner, more sustainable future.',
  href: '/about-us',
  accent: '#14B8A6',
};

export function metaFor(title: string): BusinessMeta {
  const match = META_RULES.find((rule) => rule.test.test(title));
  return match ? match.meta : DEFAULT_META;
}

export type AmbientFxVariant = 'ash' | 'leaf' | 'wind';

const FX_RULES: Array<{ test: RegExp; variant: AmbientFxVariant }> = [
  { test: /ash|coal/i, variant: 'ash' },
  { test: /green mobility|mobility/i, variant: 'leaf' },
  { test: /venwind|wind/i, variant: 'wind' },
];

export function fxFor(title: string): AmbientFxVariant | null {
  const match = FX_RULES.find((rule) => rule.test.test(title));
  return match ? match.variant : null;
}
