export interface StatePresence {
  id: string;
  name: string;
  verticals: string[];
  headquarters?: boolean;
  summary?: string;
}

export interface BusinessVertical {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  accent: string;
  states: number;
}

export const REFEX_BUSINESS_VERTICALS: BusinessVertical[] = [
  {
    id: 'ash-coal',
    name: 'Ash & Coal Handling',
    shortLabel: 'Ash & Coal',
    description: 'Integrated coal handling and sustainable ash utilization for thermal power plants.',
    accent: '#f97316',
    states: 16,
  },
  {
    id: 'mobility',
    name: 'Green Mobility',
    shortLabel: 'Mobility',
    description: 'Technology-enabled electric fleets and cleaner corporate transportation solutions.',
    accent: '#7cd244',
    states: 5,
  },
  {
    id: 'renewable',
    name: 'Renewable Energy',
    shortLabel: 'Renewables',
    description: 'Wind energy manufacturing and localized renewable power development.',
    accent: '#3b82f6',
    states: 9,
  },
  
];

const VERTICAL_NAMES = new Set(REFEX_BUSINESS_VERTICALS.map((v) => v.name));

function filterVerticals(verticals: string[]) {
  return verticals.filter((v) => VERTICAL_NAMES.has(v));
}

/** Refex operational footprint — update as CMS/state data becomes available. */
export const REFEX_STATE_PRESENCE: StatePresence[] = [
  {
    id: 'IN-TN',
    name: 'Tamil Nadu',
    headquarters: true,
    summary: 'Corporate headquarters & multi-vertical operations',
    verticals: [
      'Ash & Coal Handling',
      'Green Mobility',
      'Renewable Energy',
      'Pharma & Life Sciences',
    ],
  },
  {
    id: 'IN-KA',
    name: 'Karnataka',
    summary: 'South India operations hub',
    verticals: ['Ash & Coal Handling', 'Green Mobility', 'Renewable Energy'],
  },
  {
    id: 'IN-MH',
    name: 'Maharashtra',
    summary: 'Western region presence',
    verticals: ['Ash & Coal Handling', 'Green Mobility'],
  },
  {
    id: 'IN-GJ',
    name: 'Gujarat',
    summary: 'Industrial & energy corridor',
    verticals: ['Ash & Coal Handling', 'Renewable Energy'],
  },
  {
    id: 'IN-RJ',
    name: 'Rajasthan',
    summary: 'North-west operations',
    verticals: ['Ash & Coal Handling', 'Renewable Energy'],
  },
  {
    id: 'IN-MP',
    name: 'Madhya Pradesh',
    summary: 'Central India footprint',
    verticals: ['Ash & Coal Handling', 'Renewable Energy'],
  },
  {
    id: 'IN-UP',
    name: 'Uttar Pradesh',
    summary: 'North India operations',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-WB',
    name: 'West Bengal',
    summary: 'Eastern region presence',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-AP',
    name: 'Andhra Pradesh',
    summary: 'Coastal & industrial belt',
    verticals: ['Ash & Coal Handling', 'Renewable Energy'],
  },
  {
    id: 'IN-TG',
    name: 'Telangana',
    summary: 'Hyderabad region operations',
    verticals: ['Ash & Coal Handling', 'Green Mobility', 'Renewable Energy'],
  },
  {
    id: 'IN-CT',
    name: 'Chhattisgarh',
    summary: 'Power & mining belt',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-JH',
    name: 'Jharkhand',
    summary: 'Eastern mining corridor',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-OR',
    name: 'Odisha',
    summary: 'East coast industrial presence',
    verticals: ['Ash & Coal Handling', 'Renewable Energy'],
  },
  {
    id: 'IN-DL',
    name: 'New Delhi',
    summary: 'National capital region',
    verticals: ['Green Mobility'],
  },
  {
    id: 'IN-HR',
    name: 'Haryana',
    summary: 'NCR extended operations',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-PB',
    name: 'Punjab',
    summary: 'Northern India presence',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-AS',
    name: 'Assam',
    summary: 'North-east operations',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-ML',
    name: 'Meghalaya',
    summary: 'North-east footprint',
    verticals: ['Ash & Coal Handling'],
  },
  {
    id: 'IN-TR',
    name: 'Tripura',
    summary: 'North-east presence',
    verticals: ['Ash & Coal Handling'],
  },
].map((state) => ({
  ...state,
  verticals: filterVerticals(state.verticals),
}));

export const PRESENCE_VERTICAL_OPTIONS = [
  'Ash & Coal Handling',
  'Green Mobility',
  'Renewable Energy',
] as const;

export function normalizePresenceStates(states?: StatePresence[] | null): StatePresence[] {
  if (!Array.isArray(states) || states.length === 0) return REFEX_STATE_PRESENCE;
  return states.map((state) => ({
    ...state,
    verticals: filterVerticals(state.verticals || []),
  }));
}

export function withVerticalCounts(states: StatePresence[]): BusinessVertical[] {
  return REFEX_BUSINESS_VERTICALS.map((vertical) => ({
    ...vertical,
    states: states.filter((state) => state.verticals.includes(vertical.name)).length,
  }));
}

export const PRESENCE_BY_STATE_ID = Object.fromEntries(
  REFEX_STATE_PRESENCE.map((state) => [state.id, state]),
) as Record<string, StatePresence>;

export const PRESENCE_STATE_IDS = new Set(REFEX_STATE_PRESENCE.map((s) => s.id));

export const PRESENCE_STATE_COUNT = REFEX_STATE_PRESENCE.length;
