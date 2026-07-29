import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  FileText,
  Leaf,
  type LucideIcon,
} from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { useEsgReveal } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface Report {
  id: number;
  title: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface ReportsSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

const FALLBACK_HEADER: ReportsSectionHeader = {
  id: 1,
  title: 'REPORTS',
  isActive: true,
};

const FALLBACK_REPORTS: Report[] = [
  {
    id: 1,
    title: 'Sustainability Report',
    image: 'https://refex.co.in/wp-content/uploads/2025/02/sustainibility-report-new.jpg',
    link: 'https://refex.co.in/wp-content/uploads/2025/02/Sustainability-Report-2023-24.pdf',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'BRSR',
    image: 'https://refex.co.in/wp-content/uploads/2025/01/brsr-dashboard.jpg',
    link: 'https://refex.co.in/wp-content/uploads/2025/09/BRSR.pdf',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'ESG Performance Dashboard',
    image: 'https://refex.co.in/wp-content/uploads/2024/12/esg-dashboard.jpg',
    link: 'https://refex.co.in/wp-content/uploads/2025/07/ESG_Dashboard_FY-24-25-1.pdf',
    order: 3,
    isActive: true,
  },
];

const REPORT_ACCENTS = ['#4C8C2B', '#0072CE', '#F39200'] as const;
const REPORT_ICONS: LucideIcon[] = [Leaf, FileText, BarChart3];

function ReportCard({
  report,
  index,
  revealed,
}: {
  report: Report;
  index: number;
  revealed: boolean;
}) {
  const accent = REPORT_ACCENTS[index % REPORT_ACCENTS.length];
  const Icon = REPORT_ICONS[index] ?? FileText;
  const orderLabel = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_18px_50px_rgba(76,140,43,0.08)] transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-[0_26px_64px_rgba(76,140,43,0.14)] ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{
        transitionDelay: revealed ? `${140 + index * 100}ms` : '0ms',
        ['--report-accent' as string]: accent,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--report-accent)] transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7faf5]">
        <img
          src={getFullUrl(report.image)}
          alt={report.title}
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
            {report.title}
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
            PDF Report
          </span>
        </div>

        <a
          href={getFullUrl(report.link)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-between gap-3 rounded-xl border border-[#e3ebe0] bg-[#f7faf5] px-4 py-3.5 transition-all duration-300 hover:border-[var(--report-accent)] hover:bg-white hover:shadow-[0_8px_24px_rgba(76,140,43,0.08)]"
        >
          <span className="inline-flex items-center gap-2">
            <FileText
              className="h-4 w-4 transition-colors"
              style={{ color: accent }}
              strokeWidth={2}
              aria-hidden
            />
            <span
              className="text-sm font-semibold transition-colors"
              style={{ color: accent }}
            >
              View Report
            </span>
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

export default function ReportsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [header, setHeader] = useState<ReportsSectionHeader | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const motionReady = useEsgReveal(sectionRef, !loading);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      let headerData = null;
      let reportsData: Report[] = [];

      try {
        headerData = await esgCmsApi.getReportsSection();
      } catch (err: unknown) {
        console.warn('Failed to fetch reports section header:', err);
      }

      try {
        reportsData = await esgCmsApi.getReports();
      } catch (err: unknown) {
        console.warn('Failed to fetch reports:', err);
      }

      if (
        headerData &&
        (headerData.isActive === true ||
          headerData.isActive === undefined ||
          headerData.isActive === null)
      ) {
        setHeader(headerData);
      } else {
        setHeader(FALLBACK_HEADER);
      }

      const activeReports = (reportsData || [])
        .filter((report) => report.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setReports(activeReports.length > 0 ? activeReports : FALLBACK_REPORTS);
    } catch (error) {
      console.error('Failed to fetch reports section:', error);
      setHeader(FALLBACK_HEADER);
      setReports(FALLBACK_REPORTS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading reports section..." />;
  }

  if (reports.length === 0) {
    return null;
  }

  const displayHeader = header || FALLBACK_HEADER;
  const motionReadyResolved = motionReady || prefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="esg-reports"
      className={`relative overflow-hidden bg-[#f3f3f3] ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="esg-reports-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#F39200]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#0072CE]/8 blur-3xl"
      />

      <div className={`relative z-10 ${esgContainer}`}>
        <EsgSectionHeader
          badgeIcon={FileText}
          badgeLabel="Transparency & Disclosure"
          accent="orange"
          title={displayHeader.title}
          titleId="esg-reports-title"
          motionReady={motionReadyResolved}
        />

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {reports.map((report, index) => (
            <ReportCard
              key={report.id}
              report={report}
              index={index}
              revealed={motionReadyResolved}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
