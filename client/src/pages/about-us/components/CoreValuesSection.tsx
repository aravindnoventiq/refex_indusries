import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { getPlaceholderImage } from '../../../utils/placeholder';
import { FALLBACK_VALUES } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

interface ValueItem {
  id: number;
  letter?: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export default function CoreValuesSection() {
  const [values, setValues] = useState<ValueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getValues();
        const activeValues = (data || [])
          .filter((item: ValueItem) => item.isActive !== false)
          .sort((a: ValueItem, b: ValueItem) => (a.order || 0) - (b.order || 0));
        setValues(activeValues.length > 0 ? activeValues : FALLBACK_VALUES);
      } catch {
        setValues(FALLBACK_VALUES);
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, []);

  const { classes } = useDarkPageTheme();
  const { text, imageCard } = classes;

  if (loading) {
    return (
      <div id="core-values">
        <AboutSpinner />
      </div>
    );
  }

  const displayValues = values.length > 0 ? values : FALLBACK_VALUES;

  return (
    <AboutSectionShell
      id="core-values"
      // eyebrow="Culture"
      title="Core Values"
      // subtitle="The principles that shape how we work, lead, and grow together."
    >
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {displayValues.map((value, index) => (
          <AboutReveal key={value.id} delay={index * ABOUT_REVEAL_STAGGER_MS}>
            <article className={`group relative flex h-full flex-col ${imageCard}`}>
            <div className="absolute left-0 top-0 z-10 h-1 w-full origin-left scale-x-0 bg-[#7cd244] transition-transform duration-300 group-hover:scale-x-100" />

            <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
              <img
                src={value.image}
                alt={value.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPlaceholderImage(400, 256, 'No Image');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className={`absolute left-4 top-4 ${text.meta}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {value.letter && (
                <span className="absolute bottom-3 right-4 text-5xl font-semibold leading-none text-white/90 drop-shadow-sm sm:text-6xl">
                  {value.letter}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col px-5 py-5">
              <h3
                className={`${text.cardTitle} transition-colors duration-300 group-hover:text-[#7cd144]`}
              >
                {value.title}
              </h3>
              <div
                className={
                  'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
                  'grid-rows-[0fr] opacity-0 ' +
                  'group-hover:grid-rows-[1fr] group-hover:opacity-100 ' +
                  'group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 ' +
                  '[@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100'
                }
              >
                <p className={`mt-2 min-h-0 overflow-hidden ${text.bodySm}`}>
                  {value.description}
                </p>
              </div>
            </div>
          </article>
          </AboutReveal>
        ))}
      </div>
    </AboutSectionShell>
  );
}
