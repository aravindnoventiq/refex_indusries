import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  FileCheck,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { useEsgReveal } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface Policy {
  id: number;
  title: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface PoliciesSectionHeader {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
}

const FALLBACK_HEADER: PoliciesSectionHeader = {
  id: 1,
  title: 'ESG POLICIES',
  description:
    'Sustainable development is a fundamental value we prioritize. Our management team is deeply dedicated to this objective, ensuring it is embedded in our policies and procedures covering environmental, social, and governance aspects.',
  isActive: true,
};

const FALLBACK_POLICIES: Policy[] = [
  {
    id: 1,
    title: 'Quality Policy',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/1128e6028c267b8815610fa95a55bdd6.jpeg',
    link: 'https://refex.co.in/wp-content/uploads/2024/12/Quality-Policy.pdf',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'EHS policy',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/559620381e3172f57ad556f2d25c4c5f.jpeg',
    link: 'https://refex.co.in/wp-content/uploads/2024/12/EHS-Policy.pdf',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'Sustainability Policy',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/71965c8784563959b900528cb5104401.jpeg',
    link: 'https://refex.co.in/wp-content/uploads/2024/12/Sustainability-ESG-Policy.pdf',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    title: 'Grievance Policy',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/1731653886eed719dcd84da082342c61.png',
    link: 'https://refex.co.in/wp-content/uploads/2024/12/Grievance-Policy.pdf',
    order: 4,
    isActive: true,
  },
];

const POLICY_ACCENTS = ['#4C8C2B', '#0072CE', '#F39200', '#2d5016'] as const;
const POLICY_ICONS: LucideIcon[] = [FileCheck, ShieldCheck, Leaf, HeartHandshake];

function PolicyCard({
  policy,
  index,
  revealed,
}: {
  policy: Policy;
  index: number;
  revealed: boolean;
}) {
  const accent = POLICY_ACCENTS[index % POLICY_ACCENTS.length];
  const Icon = POLICY_ICONS[index] ?? FileCheck;
  const orderLabel = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_18px_50px_rgba(76,140,43,0.08)] transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-[0_26px_64px_rgba(76,140,43,0.14)] ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{
        transitionDelay: revealed ? `${140 + index * 90}ms` : '0ms',
        ['--policy-accent' as string]: accent,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--policy-accent)] transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7faf5]">
        <img
          src={getFullUrl(policy.image)}
          alt={policy.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1f1f]/55 via-[#1f1f1f]/10 to-transparent"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-white backdrop-blur-sm"
            style={{ backgroundColor: `${accent}cc` }}
          >
            {orderLabel}
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/20 text-white backdrop-blur-sm">
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <h3 className="text-lg font-bold leading-snug text-white drop-shadow-sm sm:text-xl">
            {policy.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
            Policy Document
          </span>
        </div>

        <a
          href={getFullUrl(policy.link)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-between gap-3 rounded-xl border border-[#e3ebe0] bg-[#f7faf5] px-4 py-3.5 transition-all duration-300 hover:border-[var(--policy-accent)] hover:bg-white hover:shadow-[0_8px_24px_rgba(76,140,43,0.08)]"
        >
          <span
            className="text-sm font-semibold transition-colors"
            style={{ color: accent }}
          >
            View Policy
          </span>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: accent }}
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          </span>
        </a>
      </div>
    </article>
  );
}

export default function ESGPoliciesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [header, setHeader] = useState<PoliciesSectionHeader | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const motionReady = useEsgReveal(sectionRef, !loading);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [headerData, policiesData] = await Promise.all([
        esgCmsApi.getPoliciesSection(),
        esgCmsApi.getPolicies(),
      ]);

      if (
        headerData &&
        (headerData.isActive === true ||
          headerData.isActive === undefined ||
          headerData.isActive === null)
      ) {
        setHeader(headerData);
      } else {
        setHeader(null);
      }

      const activePolicies = (policiesData || [])
        .filter((policy: Policy) => policy.isActive)
        .sort((a: Policy, b: Policy) => (a.order || 0) - (b.order || 0));

      setPolicies(activePolicies);
    } catch (error) {
      console.error('Failed to fetch policies section:', error);
      setHeader(FALLBACK_HEADER);
      setPolicies(FALLBACK_POLICIES);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading policies section..." />;
  }

  if (!header || policies.length === 0) {
    return null;
  }

  const motionReadyResolved = motionReady || prefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="esg-policies"
      className={`relative overflow-hidden bg-white ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="esg-policies-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#4C8C2B]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#0072CE]/8 blur-3xl"
      />

      <div className={`relative z-10 ${esgContainer}`}>
        <EsgSectionHeader
          badgeIcon={ShieldCheck}
          badgeLabel="Framework & Standards"
          accent="green"
          title={header.title}
          titleId="esg-policies-title"
          motionReady={motionReadyResolved}
          description={header.description}
          align="center"
        />

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {policies.map((policy, index) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              index={index}
              revealed={motionReadyResolved}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
