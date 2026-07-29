import { useState, useEffect } from 'react';
import { esgCmsApi } from '../../../services/api';
import EsgSectionShell from './EsgSectionShell';
import EsgSectionLoader from './EsgSectionLoader';
import { getFullUrl } from '../esgUtils';
import { esgBgLight, esgSectionTitle, esgSectionSubtitle } from '../esgLayout';

interface SdgSection {
  id: number;
  title: string;
  content?: string;
  image?: string;
  isActive: boolean;
}

export default function SDGSection() {
  const [section, setSection] = useState<SdgSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    // Default fallback data
    const fallbackSection: SdgSection = {
      id: 1,
      title: 'SUSTAINABLE DEVELOPMENT GOALS',
      content: `We're all about making the world a better place! We're committed to working with India and the UN to achieve United Nations Sustainable Development Goals, because we know that together we can make a big difference. We're not just focused on making our shareholders happy – we're all about creating value for everyone involved, including the planet!

We're so proud to be a member of UNGC and to be working with partners around the world to make the world a better place. We're all about ethical business practices and doing our part to solve some of the biggest challenges of our time. Let's make the world a better place, together!`,
      image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/b386e5df75d7a9c971d04671cf57b3fe.jpeg',
      isActive: true,
    };

    try {
      setLoading(true);
      const data = await esgCmsApi.getSdgSection();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setSection(data);
      } else {
        setSection(fallbackSection);
      }
    } catch (error) {
      console.error('Failed to fetch SDG section:', error);
      // Fallback to default data on error
      setSection(fallbackSection);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading SDG section..." />;
  }

  if (!section) {
    return null;
  }

  // Split title by \n for line breaks
  const titleLines = section.title.split('\n');
  // Split content into paragraphs
  const paragraphs = section.content
    ? section.content.split(/\n\s*\n/).filter(p => p.trim())
    : [];

  return (
    <EsgSectionShell className={esgBgLight}>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="w-full">
          <h2 className={`${esgSectionTitle} mb-6`} data-esg-anim>
            {titleLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <div className={`space-y-4 ${esgSectionSubtitle}`} data-esg-anim>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>
        </div>

        {section.image && (
          <div
            data-esg-anim
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${getFullUrl(section.image)})`,
              minHeight: '360px',
              width: 'calc(100% + 80px)'
            }}
          ></div>
        )}
      </div>
    </EsgSectionShell>
  );
}
