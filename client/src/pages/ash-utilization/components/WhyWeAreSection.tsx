import { useState, useEffect, useRef } from 'react';
import { ashUtilizationCmsApi } from '../../../services/api';
import { AshSectionShell, AboutSpinner } from './AshSectionShell';
import { homeImageCard, homeVideoText } from '../../home/components/HomeSection';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';
import { ashContentGap } from '../ashLayout';

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

const FALLBACK_SECTION: WhoWeAreSection = {
  title: 'Who We Are',
  content: `Refex, a leader in the ash utilization sector since its entry in 2018, specializes in providing ash management services for coal-fired power plants, helping them mitigate the environmental pollution caused by coal combustion.

As the largest organized player in India's ash management industry, we have successfully worked across 40+ plants and repurposed the ash generated for construction of roads, highways and embankments; for filling of mines and low-lying areas, and manufacturing of cement and bricks, thereby fostering sustainable infrastructure development.

Known for our reliable, and high-quality services, we employ advanced technologies and extensive network of fleet for the safe collection, transportation, and utilization of ash, with a strong emphasis on sustainability.`,
  slides: [
    {
      image:
        'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/24687ccdb5cb91356b395ecdc1fc5b9e.jpeg',
    },
    {
      image:
        'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/7c3c2bf683875e07aefd0074156c1eaf.jpeg',
    },
  ],
  isActive: true,
};

function WhoWeAreSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [section, setSection] = useState<WhoWeAreSection | null>(null);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const data = await ashUtilizationCmsApi.getWhoWeAre();
        if (data && data.isActive !== false) {
          setSection(data);
        } else {
          setSection(FALLBACK_SECTION);
        }
      } catch {
        setSection(FALLBACK_SECTION);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, []);

  useEffect(() => {
    if (!section?.slides?.length) return;
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % section.slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [section]);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(gridRef.current!, '[data-about-anim]', { y: 28, stagger: 0.08 });
    }, gridRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div id="who-we-are">
        <AboutSpinner />
      </div>
    );
  }

  const data = section || FALLBACK_SECTION;
  const paragraphs = data.content.split('\n\n').filter((p) => p.trim());

  return (
    <AshSectionShell id="who-we-are" eyebrow="Overview" title={data.title}>
      <div
        ref={gridRef}
        className={`grid items-center lg:grid-cols-2 ${ashContentGap}`}
      >
        {data.slides?.length > 0 && (
          <div data-about-anim className={`relative overflow-hidden ${homeImageCard}`}>
            <div className="relative aspect-[4/3] w-full">
              {data.slides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.image}
                  alt={`${data.title} ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/800x600?text=Image+Not+Found';
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {data.slides.length > 1 && (
              <div className="flex justify-end gap-1.5 border-t border-white/10 px-4 py-3">
                {data.slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1 rounded-sm transition-all ${
                      index === currentSlide ? 'w-6 bg-[#f97316]' : 'w-4 bg-white/25'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div data-about-anim className={`space-y-4 ${homeVideoText.body}`}>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </AshSectionShell>
  );
}

export default WhoWeAreSection;
