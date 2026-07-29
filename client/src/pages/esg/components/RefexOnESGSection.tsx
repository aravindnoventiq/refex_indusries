import { useState, useEffect } from 'react';
import { esgCmsApi } from '../../../services/api';
import EsgSectionShell from './EsgSectionShell';
import EsgSectionLoader from './EsgSectionLoader';
import { getFullUrl } from '../esgUtils';
import { esgBgWhite, esgSectionTitle, esgSectionSubtitle } from '../esgLayout';

interface RefexOnEsgSection {
  id: number;
  title: string;
  content?: string;
  image?: string;
  isActive: boolean;
}

export default function RefexOnESGSection() {
  const [section, setSection] = useState<RefexOnEsgSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      const data = await esgCmsApi.getRefexOnEsg();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setSection(data);
      } else {
        setSection(null);
      }
    } catch (err) {
      console.error('Failed to load Refex on ESG section:', err);
      // Fallback to default data
      setSection({
        id: 1,
        title: 'Refex on ESG',
        content: `At Refex Industries Limited, we believe in creating a better world through sustainable business practices. We prioritize People, Planet, and Profit equally and are committed to becoming an ESG champion and carbon-neutral company.

By aligning with the United Nations Sustainable Development Goals, we are taking action towards a brighter future. We invite you to join hands with Refex Group in our efforts towards sustainability and make a positive impact on the world!`,
        image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/2a88034df4623de87800682ebeaf6ce1.jpeg',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading section..." />;
  }

  if (!section) {
    return null;
  }

  // Split content into paragraphs by double line breaks or single line breaks
  const paragraphs = section.content
    ? section.content.split(/\n\s*\n/).filter(p => p.trim())
    : [];

  return (
    <EsgSectionShell id="refex-esg" className={esgBgWhite}>
      <div className="grid md:grid-cols-[3.3fr_1.7fr] gap-12 items-center">
        <div
          data-esg-anim
          className="min-h-[320px] bg-contain bg-center bg-no-repeat sm:min-h-[420px] lg:min-h-[520px]"
          style={{
            backgroundImage: section.image ? `url(${getFullUrl(section.image)})` : undefined,
            backgroundColor: section.image ? undefined : '#e5e7eb',
          }}
        />

        <div>
          <h2 className={`${esgSectionTitle} mb-6`} data-esg-anim>
            {section.title}
          </h2>
          {paragraphs.length > 0 ? (
            <div className={`space-y-4 ${esgSectionSubtitle}`} data-esg-anim>
              {paragraphs.map((paragraph, index) => {
                const isFirstParagraph = index === 0;
                return (
                  <p
                    key={index}
                    className={isFirstParagraph ? 'font-bold' : ''}
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>')
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 italic">No content available.</div>
          )}
        </div>
      </div>
    </EsgSectionShell>
  );
}
