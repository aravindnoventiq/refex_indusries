import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  title?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await greenMobilityCmsApi.getTestimonials();
      const activeTestimonials = (data || []).filter((testimonial: Testimonial) => testimonial.isActive);
      setTestimonials(activeTestimonials);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      // Fallback to default data
      setTestimonials([
        {
          id: 1,
          text: 'Refex eVeelz sets a golden standard for airport transfers. We are happy with consistently reliable, professional drivers and impeccable service every time. For premium eco-friendly airport rides, Refex Green Mobility is our only choice.',
          name: 'Varun Keswani',
          title: 'Transferz',
          image: 'https://refex.co.in/wp-content/uploads/2025/02/cropped-TransferZ-site-icon-2-1.png',
          order: 0,
          isActive: true,
        },
        {
          id: 2,
          text: 'We bring in a lot of guest speakers and mentors, and this mobility service has made a world of difference. Our guests always comment on how smooth the ride is, and they appreciate not having to figure out transportation after a long flight. It makes everything easier for us and for them.',
          name: 'Anonymous',
          title: '',
          image: 'https://refex.co.in/wp-content/uploads/2025/02/user-img.jpeg',
          order: 1,
          isActive: true,
        },
        {
          id: 3,
          text: 'We are happy with the employee transportation service! It has definitely improved our team\'s daily travel experience. Reliable, punctual, safe and comfortable',
          name: 'Anonymous',
          title: '',
          image: 'https://refex.co.in/wp-content/uploads/2025/02/user-img.jpeg',
          order: 2,
          isActive: true,
        },
        {
          id: 4,
          text: 'I booked this ride for my daughter who was travelling alone. This time she was so happy because of the receiving method and behaviour of the driver. Extremely happy!',
          name: 'Anonymous',
          title: '',
          image: 'https://refex.co.in/wp-content/uploads/2025/02/user-img.jpeg',
          order: 3,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const sortedTestimonials = [...testimonials].sort((a, b) => (a.order || 0) - (b.order || 0));

  const getDisplayTestimonials = () => {
    if (sortedTestimonials.length === 0) return [];
    const first = sortedTestimonials[currentSlide];
    const second = sortedTestimonials[(currentSlide + 1) % sortedTestimonials.length];
    return [first, second];
  };

  if (loading) {
    return (
      <div className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (sortedTestimonials.length === 0) {
    return (
      <div className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 py-12">
            No testimonials available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold mb-4" style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}>
            What People Say About Us
          </h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="overflow-hidden w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300 w-full">
              {getDisplayTestimonials().map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${currentSlide}-${index}`}
                  className="p-8 transition-all duration-300 w-full"
                  style={{ backgroundColor: '#f3f3f3' }}
                >
                  <div className="flex flex-col h-full">
                    <p className="leading-relaxed mb-6 flex-grow" style={{ fontSize: '19px', color: '#1f1f1f', fontFamily: 'Roboto, sans-serif' }}>
                      {testimonial.text}
                    </p>
                    <div className="flex items-center gap-4">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900" style={{ fontSize: '20px' }}>{testimonial.name}</h4>
                        {testimonial.title && (
                          <p className="text-gray-600" style={{ fontSize: '16px' }}>{testimonial.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {sortedTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: index === currentSlide ? '#6cc24a' : '#ffffff',
                  border: index === currentSlide ? 'none' : '2px solid #cccccc',
                  minWidth: '12px'
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
