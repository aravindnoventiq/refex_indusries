import { useState, useEffect } from 'react';
import { esgCmsApi } from '../../../services/api';
import EsgSectionShell from './EsgSectionShell';
import EsgSectionLoader from './EsgSectionLoader';
import { getFullUrl } from '../esgUtils';
import { esgBgLight, esgSectionTitle, esgSectionSubtitle } from '../esgLayout';

interface SustainableBusinessSection {
  id: number;
  title: string;
  content?: string;
  image?: string;
  isActive: boolean;
}

export default function SustainableBusinessSection() {
  const [section, setSection] = useState<SustainableBusinessSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      const data = await esgCmsApi.getSustainableBusiness();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setSection(data);
      } else {
        setSection(null);
      }
    } catch (err) {
      console.error('Failed to load Sustainable Business section:', err);
      // Fallback to default data
      setSection({
        id: 1,
        title: 'Sustainable Business Model',
        content: `In the fast-evolving landscape of the business world, only a handful of companies manage to transcend the boundaries of their niche and ascend to the coveted status of a regime. Refex Industries Limited stands tall among such remarkable success stories that have taken India to the world – from our humble beginnings in a specialized market in refrigerant gases to becoming a major entity working across diverse business verticals. Refex Industries Limited's business model is pivotal to sustainability, innovation, and offering eco-friendly solutions.

Alongside these efforts, our ash handling division continues to mitigate environmental risks and climate change by facilitating mine rehabilitation, recycling coal ash and ensuring material circularity, converting degraded land into usable spaces, and reducing the strain on agricultural and forest areas.

Refex Green Mobility Limited (RGML), a subsidiary of Refex Industries Limited (RIL), proudly emerged into the mobility space during the fiscal year 2022-23, making a profound statement of Refex Group's unwavering dedication to embracing a green business model and making substantial contributions to combat climate change.

Venwind Refex is advancing India's clean energy transition through sustainable wind turbine manufacturing. In collaboration with global technology leaders, we deliver efficient, reliable, and environmentally responsible solutions—driven by local production and a strong supply chain to enable scalable, low-carbon growth.`,
        image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/4378e87ea65febdcf15274ee7cb74af4.jpeg',
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
    <EsgSectionShell className={esgBgLight}>
      <div className="grid md:grid-cols-2 items-center">
        <div>
          <h2 className={`${esgSectionTitle} mb-6`} data-esg-anim>
            {section.title}
          </h2>
          {paragraphs.length > 0 ? (
            <div className={`space-y-4 ${esgSectionSubtitle}`} data-esg-anim>
              {paragraphs.map((paragraph, index) => {
                return (
                  <p
                    key={index}
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

        <div className="flex justify-end" data-esg-anim>
          <div
            className="bg-contain bg-center bg-no-repeat"
            style={{
              width: '418px',
              height: '765px',
              backgroundImage: section.image ? `url(${getFullUrl(section.image)})` : undefined,
              backgroundColor: section.image ? undefined : '#e5e7eb',
            }}
          ></div>
        </div>
      </div>
    </EsgSectionShell>
  );
}
