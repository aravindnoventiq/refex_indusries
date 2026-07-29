import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface HeroSlide {
  image: string;
}

interface WhoWeAreSection {
  id?: number;
  title: string;
  content: string;
  slides: HeroSlide[];
  isActive: boolean;
}

function WhoWeAreSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [section, setSection] = useState<WhoWeAreSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const data = await greenMobilityCmsApi.getWhoWeAre();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setSection(data);
        } else {
          // Fallback to default if no active section
          setSection({
            title: 'Who we are',
            content: `Refex Green Mobility Limited (RGML) is a wholly-owned subsidiary of Refex Group's flagship listed entity, Refex Industries Limited. RGML underscores the group's commitment to sustainability and delivers clean mobility services for corporate transportation needs and B2B2C use cases with 1400+ company-owned vehicles. It leverages technology and aims to transform the mobility sector.

Operating under the brand name "Refex Mobility", RGML runs 100% cleaner-fueled vehicles. At Refex Mobility, we go beyond transportation, and we invite you to be part of a movement redefining sustainable mobility.

Enhance your journey with us and step into a future where sustainability meets innovation.`,
            slides: [
              { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/319045c7be24f4e8a3deefca78397a71.jpeg' },
              { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e2fa783f3fad9b4758e37718667ab796.jpeg' },
            ],
            isActive: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch who we are section:', error);
        // Fallback to default data if API fails
        setSection({
          title: 'Who we are',
          content: `Refex Green Mobility Limited (RGML) is a wholly-owned subsidiary of Refex Group's flagship listed entity, Refex Industries Limited. RGML underscores the group's commitment to sustainability and delivers clean mobility services for corporate transportation needs and B2B2C use cases with 1400+ company-owned vehicles. It leverages technology and aims to transform the mobility sector.

Operating under the brand name "Refex Mobility", RGML runs 100% cleaner-fueled vehicles. At Refex Mobility, we go beyond transportation, and we invite you to be part of a movement redefining sustainable mobility.

Enhance your journey with us and step into a future where sustainability meets innovation.`,
          slides: [
            { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/319045c7be24f4e8a3deefca78397a71.jpeg' },
            { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e2fa783f3fad9b4758e37718667ab796.jpeg' },
          ],
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, []);

  useEffect(() => {
    if (!section || !section.slides || section.slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % section.slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [section]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="py-10 sm:py-16 lg:py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-10 sm:py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading who we are section...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!section || !section.slides || section.slides.length === 0) {
    return null;
  }

  // Split content by double line breaks to create paragraphs
  const paragraphs = section.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="py-10 sm:py-16 lg:py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Slider */}
          <div className="animate-fadeInLeft">
            <div className="relative overflow-hidden" style={{ width: '603px', height: '399px' }}>
              {section.slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={`Who we are ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=No+Image';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Dots - Outside Image */}
            {section.slides.length > 1 && (
              <div className="flex justify-end mt-2 gap-1.5">
                {section.slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-6 h-1.5 rounded-sm transition-all cursor-pointer ${
                      index === currentSlide ? 'bg-black' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="animate-fadeInRight">
            <span 
              className="font-semibold mb-4 block" 
              style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}
              data-aos="fade-right"
            >
              {section.title}
            </span>
            <div className="space-y-4 leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
              {paragraphs.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br />') }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhoWeAreSection;
