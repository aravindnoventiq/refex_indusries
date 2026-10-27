import { useEffect, useState } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { AboutSectionShell } from './AboutSectionShell';

function toParagraphs(content?: string) {
  const raw = (content || '').trim();
  if (!raw) return [];
  const blocks = raw.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  if (blocks.length > 1) return blocks;
  return raw.split(/\n/).map((part) => part.trim()).filter(Boolean);
}

export default function AboutSection() {
  const { classes } = useDarkPageTheme();
  const { text } = classes;
  const [title, setTitle] = useState('Who We Are');
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    aboutCmsApi
      .getAboutPageSection()
      .then((data) => {
        if (cancelled || !data || data.isActive === false) return;
        if (typeof data.title === 'string' && data.title.trim()) setTitle(data.title.trim());
        setParagraphs(toParagraphs(data.content));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const copy = paragraphs.length
    ? paragraphs
    : ['Content for this section is being reworked and will be updated shortly.'];

  return (
    <AboutSectionShell
      id="about"
      title={title}
      sectionPad="pt-10 pb-10 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16"
    >
      <div className="max-w-3xl space-y-4">
        {copy.map((paragraph, index) => (
          <p key={index} className={`text-[1.05rem] leading-[1.75] sm:text-lg ${text.body}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </AboutSectionShell>
  );
}
