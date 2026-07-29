/** Offline / empty-CMS fallbacks aligned with refex.co.in About Us content. */
export { FALLBACK_BOARD_MEMBERS } from './boardMembersFallback';
import type { BoardMemberFallback } from './boardMembersFallback';
export type { BoardMemberFallback };

/** Merge CMS board rows with fallback biography / directorship / linkedin when missing. */
export function enrichBoardMembers<T extends {
  name: string;
  biography?: string;
  directorshipDetails?: string;
  linkedin?: string;
  image?: string;
  position?: string;
}>(members: T[], fallbacks: BoardMemberFallback[]): T[] {
  const byName = new Map(fallbacks.map((f) => [f.name.trim().toLowerCase(), f]));
  return members.map((m) => {
    const fb = byName.get(m.name.trim().toLowerCase());
    if (!fb) return m;
    return {
      ...m,
      biography: m.biography?.trim() || fb.biography,
      directorshipDetails: m.directorshipDetails?.trim() || fb.directorshipDetails,
      linkedin: m.linkedin?.trim() || fb.linkedin,
      image: m.image || fb.image,
      position: m.position || fb.position,
    };
  });
}

export const FALLBACK_ABOUT_CONTENT = `Founded in 2002, Refex Industries Limited is a diversified enterprise committed to building sustainable solutions for a rapidly evolving India.

Our businesses span coal and ash management, clean mobility, and renewable energy: sectors that are critical to the country's growth and energy transition. Through integrated solutions in resource management, cleaner transportation, and wind energy, we create long-term value while advancing environmental responsibility.

We provide integrated coal handling and sustainable ash utilization solutions for thermal power plants, ensuring operational reliability & enabling regulatory compliance and responsible resource efficiency. Through Refex Green Mobility Limited, we are accelerating the adoption of cleaner transportation through technology-enabled mobility solutions. Our renewable energy subsidiary, Venwind Refex, is advancing India's wind energy ambitions through localized manufacturing, cutting-edge technology and engineering excellence.

Driven by innovation, sustainability, and execution, Refex continues to transform challenges into opportunities. We are committed to building solutions that contribute to a cleaner, more resilient future.`;

export const FALLBACK_MISSION =
  'Refex shall create enduring value across industries through innovation, operational excellence, and sustainable practices, thereby empowering our customers, enriching our communities, and delivering responsible growth for all stakeholders.';

export const FALLBACK_VISION =
  'Refex aims to be a globally admired conglomerate, driving long-term sustainable growth through innovation, purposeful collaborations and partnerships, and an unwavering commitment to excellence, while contributing meaningfully to societal progress';

export const FALLBACK_VALUES = [
  {
    id: 1,
    letter: 'P',
    title: 'Principled Excellence',
    description: "Doing what's right, with integrity and intention",
    image: 'https://refex.co.in/wp-content/uploads/2024/11/our-values05.jpg',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    letter: 'A',
    title: 'Authenticity',
    description: 'Bringing your true self to work, and honouring that in others.',
    image: 'https://refex.co.in/wp-content/uploads/2025/06/our-values032.jpg',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    letter: 'C',
    title: 'Customer Value',
    description: 'Keeping our customers at the heart of everything we do.',
    image: 'https://refex.co.in/wp-content/uploads/2024/11/our-values01.jpg',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    letter: 'E',
    title: 'Esteem Culture',
    description:
      'Fostering a workplace where respect, dignity, and belonging are everyday experiences.',
    image: 'https://refex.co.in/wp-content/uploads/2024/11/our-values02.jpg',
    order: 4,
    isActive: true,
  },
];

export const FALLBACK_LEADERSHIP = [
  {
    id: 1,
    name: 'Purvesh Kapadia',
    position: 'Group CHRO',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/a3cdce632dade111205dc229ca702480.jpeg',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    name: 'Jagdish Jain',
    position: 'Business Head – Ash & Coal Handling',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/f2538c4119485fe4950056c01b3ea5c1.jpeg',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'Tarun Arora',
    position: 'Chief Business Officer - Ash & Coal Handling',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/7d00bda8147f6ca0402ffe4d0229c91a.jpeg',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    name: 'Vishesh Mehta',
    position: 'Head – Business Development',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/df5cd0840e6728325f93359639aa6af7.jpeg',
    order: 4,
    isActive: true,
  },
  {
    id: 13,
    name: 'Harsh Dugar',
    position: 'CGO - Ash Handling',
    image: '/leadership-harsh-dugar.png',
    order: 5,
    isActive: true,
  },
  {
    id: 5,
    name: 'Gautam Jain',
    position: 'Head – Investor Relations',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/6320746249dc94215f9abbc6931360d3.jpeg',
    order: 6,
    isActive: true,
  },
  {
    id: 6,
    name: 'Sahil Singla',
    position: 'President – Corporate Finance',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/7aa09c07a2f5ee0987f94fe77b52ad97.jpeg',
    order: 7,
    isActive: true,
  },
  {
    id: 7,
    name: 'Sonal Jain',
    position: 'VP – Accounts & Taxation',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/249a08fe6439bff3b3dd144954f457dc.jpeg',
    order: 8,
    isActive: true,
  },
  {
    id: 8,
    name: 'Ankit Poddar',
    position: 'Head - Company Secretarial',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/35e0da7c9f5ab0865c3900218fd86ee5.jpeg',
    order: 9,
    isActive: true,
  },
  {
    id: 9,
    name: 'Harini Sriraman',
    position: 'VP – Group General Counsel',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/a91805dd99005b82031b3337c82f6be9.jpeg',
    order: 10,
    isActive: true,
  },
  {
    id: 10,
    name: 'Srividya Nirmalkumar',
    position: 'VP – Corporate Communications',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/49646d988247ba663117d728c1a33578.jpeg',
    order: 11,
    isActive: true,
  },
  {
    id: 11,
    name: 'Suhail Shariff',
    position: 'VP – Administration & Facility',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/141c0f21775768dd0d8085ff8a4045a3.jpeg',
    order: 12,
    isActive: true,
  },
  {
    id: 12,
    name: 'Srivaths Varadharajan',
    position: 'Group CTO',
    image:
      'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/b5a87c6ce8126d6f195386692ea36204.jpeg',
    order: 13,
    isActive: true,
  },
  {
    id: 14,
    name: 'Jaya Krishna',
    position: 'Director - Corporate Finance',
    image: '/leadership-jaya-krishna.png',
    order: 14,
    isActive: true,
  },
  {
    id: 15,
    name: 'Prasad Jakkaraju',
    position: 'Group Head - ESG',
    image: '/leadership-prasad-jakkaraju.png',
    order: 15,
    isActive: true,
  },
  {
    id: 16,
    name: 'Mili Dubey',
    position: 'Head – Policy Advocacy & Corporate Affairs',
    image: '/leadership-mili-dubey.png',
    order: 16,
    isActive: true,
  },
];

export const COMMITTEE_NAME_COLOR = '#7cd144';

export const FALLBACK_COMMITTEES = [
  {
    id: 1,
    name: 'Audit Committee',
    order: 1,
    isActive: true,
    members: [
      {
        id: 1,
        name: 'Mr. Ramesh Dugar',
        designation: 'Independent Director',
        category: 'Chairman',
        order: 1,
        isActive: true,
      },
      {
        id: 2,
        name: 'Mr. Dinesh Kumar Agarwal',
        designation: 'Whole-time Director & CFO',
        category: 'Member',
        order: 2,
        isActive: true,
      },
      {
        id: 3,
        name: 'Mr. Sivaramakrishnan Vasudevan',
        designation: 'Independent Director',
        category: 'Member',
        order: 3,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Nomination & Remuneration Committee',
    order: 2,
    isActive: true,
    members: [
      {
        id: 4,
        name: 'Mr. Ramesh Dugar',
        designation: 'Independent Director',
        category: 'Chairman',
        order: 1,
        isActive: true,
      },
      {
        id: 5,
        name: 'Mr. Anil Jain',
        designation: 'Managing Director',
        category: 'Member',
        order: 2,
        isActive: true,
      },
      {
        id: 6,
        name: 'Mr. Sivaramakrishnan Vasudevan',
        designation: 'Independent Director',
        category: 'Member',
        order: 3,
        isActive: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Stakeholders Relationship Committee',
    order: 3,
    isActive: true,
    members: [
      {
        id: 7,
        name: 'Ms. Latha Venkatesh',
        designation: 'Independent Director',
        category: 'Chairman',
        order: 1,
        isActive: true,
      },
      {
        id: 8,
        name: 'Mr. Dinesh Kumar Agarwal',
        designation: 'Whole-time director & CFO',
        category: 'Member',
        order: 2,
        isActive: true,
      },
      {
        id: 9,
        name: 'Ms. Susmitha Siripurapu',
        designation: 'Non-Executive Director',
        category: 'Member',
        order: 3,
        isActive: true,
      },
    ],
  },
  {
    id: 4,
    name: 'Corporate Social Responsibility Committee',
    order: 4,
    isActive: true,
    members: [
      {
        id: 10,
        name: 'Mr. Sivaramakrishnan Vasudevan',
        designation: 'Independent Director',
        category: 'Chairman',
        order: 1,
        isActive: true,
      },
      {
        id: 11,
        name: 'Mr. Dinesh Kumar Agarwal',
        designation: 'Whole-time director & CFO',
        category: 'Member',
        order: 2,
        isActive: true,
      },
      {
        id: 12,
        name: 'Mr. Anil Jain',
        designation: 'Executive Director',
        category: 'Member',
        order: 3,
        isActive: true,
      },
    ],
  },
  {
    id: 5,
    name: 'Risk Management Committee',
    order: 5,
    isActive: true,
    members: [
      {
        id: 13,
        name: 'Mr. Dinesh Kumar Agarwal',
        designation: 'Whole-time director & CFO',
        category: 'Chairperson',
        order: 1,
        isActive: true,
      },
      {
        id: 14,
        name: 'Ms. Susmitha Siripurapu',
        designation: 'Non-Executive Director',
        category: 'Member',
        order: 2,
        isActive: true,
      },
      {
        id: 15,
        name: 'Mr. Sivaramakrishnan Vasudevan',
        designation: 'Independent Director',
        category: 'Member',
        order: 3,
        isActive: true,
      },
      {
        id: 16,
        name: 'Ms. Harini.S',
        designation: 'VP-Legal (Holding Co.)',
        category: 'Member',
        order: 4,
        isActive: true,
      },
      {
        id: 17,
        name: 'Ms. Jahanvi Khedwal',
        designation: 'Chief of Staff (Holding Co.)',
        category: 'Member',
        order: 5,
        isActive: true,
      },
    ],
  },
  {
    id: 6,
    name: 'Banking & Authorization Committee',
    order: 6,
    isActive: true,
    members: [
      {
        id: 18,
        name: 'Mr. Anil Jain',
        designation: 'Managing Director',
        category: 'Chairman',
        order: 1,
        isActive: true,
      },
      {
        id: 19,
        name: 'Mr. Dinesh Kumar Agarwal',
        designation: 'Whole-time director & CFO',
        category: 'Member',
        order: 2,
        isActive: true,
      },
      {
        id: 20,
        name: 'Ms. Susmitha Siripurapu',
        designation: 'Non-Executive Director',
        category: 'Member',
        order: 3,
        isActive: true,
      },
    ],
  },
];

export { FALLBACK_STICKY_NAV } from './aboutNavLinks';
