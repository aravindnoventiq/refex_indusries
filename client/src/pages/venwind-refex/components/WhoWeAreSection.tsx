import { useState, useEffect } from 'react';
import { venwindRefexCmsApi } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getFullUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return `${API_BASE_URL}/${url}`;
};

interface VenwindRefexWhoWeAre {
  id: number;
  title: string;
  content?: string;
  mainImage?: string;
  smallImage?: string;
  isActive: boolean;
}

export default function WhoWeAreSection() {
  const [section, setSection] = useState<VenwindRefexWhoWeAre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      const data = await venwindRefexCmsApi.getWhoWeAre();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setSection(data);
      } else {
        setSection(null);
      }
    } catch (err) {
      console.error('Failed to load who we are section:', err);
      // Fallback to default data
      setSection({
        id: 1,
        title: 'Who we are',
        content: `Venwind Refex is a joint venture between Refex and Venwind, committed to revolutionizing wind energy in India through advanced turbine technology and sustainable solutions. With a clear vision to become one of India's leading wind turbine OEMs, we combine global innovation with deep local insights.

Through an exclusive technology license from Vensys Energy AG, Germany, we manufacture cutting-edge 5.3 MW wind turbines featuring a hybrid drivetrain and permanent magnet generator (PMG). This technology is proven worldwide—with over 120 GW of Vensys-powered wind turbines operating across five continents, in a wide range of environments and energy markets.

Our advanced manufacturing facility in India is purpose-built to scale, with a goal of reaching 5 GW in annual production capacity within five years, contributing meaningfully to India's renewable energy targets and the global energy transition.`,
        mainImage: 'https://refex.co.in/wp-content/uploads/2025/06/home-image-600x691-1.jpg',
        smallImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/4df2fa160fec066dfccd45c0b0052a39.jpeg',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!section) {
    return null;
  }

  // Split content into paragraphs by double line breaks or single line breaks
  const paragraphs = section.content
    ? section.content.split(/\n\s*\n/).filter(p => p.trim())
    : [];

  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative">
              {/* Top left small image */}
              {section.smallImage && (
                <div className="absolute -top-4 -left-2 z-10 h-24 w-24 overflow-hidden rounded-lg shadow-lg sm:-top-8 sm:-left-8 sm:h-48 sm:w-48">
                  <img
                    src={getFullUrl(section.smallImage)}
                    alt="Venwind Technology"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Main image */}
              {section.mainImage ? (
                <img
                  src={getFullUrl(section.mainImage)}
                  alt="Venwind Refex"
                  className="w-full max-w-full rounded-lg object-cover shadow-lg aspect-[538/550] sm:aspect-auto sm:max-h-[550px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex aspect-[538/550] w-full max-w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-lg sm:max-h-[550px]">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide leading-snug text-[#1f1f1f] sm:mb-8 sm:text-3xl lg:text-[2.125rem]"
              data-aos="fade-right"
            >
              {section.title}
            </h2>
            {paragraphs.length > 0 ? (
              <div className="space-y-6 leading-relaxed" style={{ fontSize: '17px', color: '#484848' }}>
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
            ) : (
              <div className="italic" style={{ fontSize: '17px', color: '#484848' }}>No content available.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
