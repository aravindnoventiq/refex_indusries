import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ashRefexGradientText } from '../ashLayout';
import { AshSectionShell } from './AshSectionShell';

const PAIRS = [
  {
    challenge: 'Legacy ash accumulation in dykes',
    need: 'Large-scale evacuation & dyke clearance capabilities',
  },
  {
    challenge: 'Evolving & complex regulatory requirements',
    need: 'Robust regulatory compliance systems',
  },
  {
    challenge: 'Fragmented utilization channels',
    need: 'Extensive industrial utilization network',
  },
  {
    challenge: 'Traceability & monitoring gaps',
    need: 'Technology-enabled monitoring',
  },
  {
    challenge: 'Siloed logistics',
    need: 'Comprehensive ash management model',
  },
] as const;

function AshUtilizationGapSection() {
  const { theme, classes } = useDarkPageTheme();
  const { text, surface } = classes;
  const isDark = theme === 'dark';
  const label = isDark ? 'text-[#c8e6b0]' : 'text-[#2d5016]';
  const challengeTone = isDark ? 'text-white/90' : 'text-[#1f1f1f]';
  const needTone = isDark ? 'text-white' : 'text-[#1f1f1f]';

  return (
    <AshSectionShell
      id="ash-utilization-gap"
      title="Bridging India’s Ash Utilization Gap"
      headerAlign="center"
    >
      <div className="overflow-hidden rounded-2xl border border-[#dfe9d8]/80">
        <div
          className={`hidden grid-cols-2 text-[11px] font-semibold uppercase tracking-[0.18em] md:grid ${
            isDark ? 'bg-white/[0.06]' : 'bg-[#f3f7ef]'
          }`}
        >
          <p className={`px-5 py-3 ${label}`}>The challenge</p>
          <p className={`border-l px-5 py-3 ${label} ${isDark ? 'border-white/10' : 'border-[#dfe9d8]'}`}>
            What the market needs
          </p>
        </div>

        <ul className="m-0 list-none p-0">
          {PAIRS.map((pair) => (
            <li
              key={pair.challenge}
              className={`grid gap-3 border-t px-4 py-4 first:border-t-0 sm:px-5 md:grid-cols-2 md:gap-0 md:px-0 md:py-0 ${
                isDark ? 'border-white/10' : 'border-[#e7efe3]'
              }`}
            >
              <div className="md:px-5 md:py-4">
                <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] md:hidden ${label}`}>
                  Challenge
                </p>
                <p className={`text-sm leading-snug sm:text-[0.95rem] ${challengeTone}`}>{pair.challenge}</p>
              </div>
              <div
                className={`md:border-l md:px-5 md:py-4 ${surface} md:bg-transparent md:shadow-none ${
                  isDark ? 'md:border-white/10' : 'md:border-[#dfe9d8]'
                }`}
              >
                <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] md:hidden ${label}`}>
                  Need
                </p>
                <p className={`text-sm font-semibold leading-snug sm:text-[0.95rem] ${needTone}`}>{pair.need}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className={`border-t px-5 py-5 text-center text-base leading-relaxed sm:text-lg ${isDark ? 'border-white/10' : 'border-[#e7efe3]'} ${text.body}`}>
          This execution gap is where <span className={ashRefexGradientText}>Refex</span> operates.
        </p>
      </div>
    </AshSectionShell>
  );
}

export default AshUtilizationGapSection;
