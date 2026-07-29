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

interface VisitWebsiteSection {
  id: number;
  title: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  isActive: boolean;
}

export default function VisitWebsiteSection() {
  const [section, setSection] = useState<VisitWebsiteSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const data = await venwindRefexCmsApi.getVisitWebsite();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setSection(data);
        } else {
          setSection(null);
        }
      } catch (error) {
        console.error('Failed to fetch visit website section:', error);
        // Fallback to default data if API fails
        setSection({
          id: 1,
          title: 'To know more about <span className="text-[#7cd244]">Venwind Refex</span>, click on',
          buttonText: 'Visit Website',
          buttonLink: 'https://venwindrefex.com/',
          backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/bce13c2e4c879e6e4c5988c20f219c90.jpeg',
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, []);

  if (loading) {
    return (
      <section className="relative py-32 bg-gray-200">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (!section) {
    return null;
  }

  return (
    <section 
      className="relative py-32 bg-cover bg-center"
      style={{
        backgroundImage: section.backgroundImage
          ? `url(${getFullUrl(section.backgroundImage)})`
          : undefined,
        backgroundColor: section.backgroundImage ? undefined : '#1f2937',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 
          className="font-bold mb-4"
          style={{ fontSize: '34px', color: '#6ae700', lineHeight: '1.68' }}
          dangerouslySetInnerHTML={{ __html: section.title }}
          data-aos="fade-right"
        />
        {section.buttonText && section.buttonLink && (
          <a
            href={section.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#7cd244] text-white text-lg font-semibold px-10 py-4 rounded-full hover:bg-[#6db038] transition-all duration-300 cursor-pointer group mt-8"
          >
            {section.buttonText}
            <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform duration-300"></i>
          </a>
        )}
      </div>
    </section>
  );
}
