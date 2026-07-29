import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../services/api';

interface HeroSlide {
  id: number;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const data = await homeCmsApi.getSlides();
        // Filter only active slides and sort by order
        const activeSlides = (data || [])
          .filter((slide: HeroSlide) => slide.isActive)
          .sort((a: HeroSlide, b: HeroSlide) => (a.order || 0) - (b.order || 0));
        setSlides(activeSlides);
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
        // Fallback to empty array or default slides if API fails
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Show loading state or empty state
  if (loading) {
    return (
      <section className="relative h-[600px] lg:h-[700px] mt-32 overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading slides...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[600px] lg:h-[700px] mt-32 overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No slides available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[600px] lg:h-[700px] mt-32 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-end pb-8 lg:pb-12">
            <div className="w-full px-4 lg:px-8 " 
              style={{ 
                 width: '100%',
              }}>
              <h1 className="text-4xl lg:text-6xl font-bold text-white text-left whitespace-nowrap min-w-max">{slide.title}</h1>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}